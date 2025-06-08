
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserOffer {
  id: string;
  buy_request_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  contact_info: any;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  buy_requests: {
    title: string;
    zone: string;
    status: string;
  } | null;
}

export const useUserOffers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<UserOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOffers = async () => {
    if (!user) {
      setOffers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching offers for seller:', user.id);
      
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          buy_requests (
            title,
            zone,
            status
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }
      
      console.log('Offers fetched:', data);
      
      const transformedData: UserOffer[] = (data || []).map(offer => ({
        ...offer,
        buy_requests: offer.buy_requests || null
      }));
      
      setOffers(transformedData);
    } catch (err) {
      console.error('Error fetching user offers:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced real-time subscription for better state updates
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for user offers:', user.id);

    const channel = supabase
      .channel('user-offers-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time offer update received:', payload);
          
          // Update the specific offer immediately for instant UI feedback
          setOffers(currentOffers => {
            const updatedOffers = currentOffers.map(offer => {
              if (offer.id === payload.new.id) {
                console.log('Updating offer in state:', offer.id, 'new status:', payload.new.status);
                return { 
                  ...offer, 
                  ...payload.new,
                  // Ensure updated_at is properly set
                  updated_at: payload.new.updated_at || new Date().toISOString()
                };
              }
              return offer;
            });
            
            console.log('Updated offers state:', updatedOffers);
            return updatedOffers;
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New offer created for seller:', payload);
          fetchUserOffers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Offer deleted for seller:', payload);
          fetchUserOffers();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    fetchUserOffers();
  }, [user]);

  return {
    offers,
    loading,
    error,
    refetch: fetchUserOffers
  };
};
