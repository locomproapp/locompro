
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
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }
      
      console.log('Fresh offers fetched:', data);
      
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

  // Enhanced real-time subscription with global channel
  useEffect(() => {
    if (!user) return;

    console.log('Setting up GLOBAL real-time subscription for user offers:', user.id);

    // Use a global channel name to catch all offer updates
    const channel = supabase
      .channel('global-user-offers-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('GLOBAL: Real-time offer update received:', payload);
          
          // Force immediate state update
          setOffers(currentOffers => {
            const updatedOffers = currentOffers.map(offer => {
              if (offer.id === payload.new.id) {
                console.log('GLOBAL: Updating offer status from', offer.status, 'to', payload.new.status);
                return { 
                  ...offer, 
                  ...payload.new,
                  status: payload.new.status,
                  rejection_reason: payload.new.rejection_reason,
                  updated_at: payload.new.updated_at || new Date().toISOString()
                };
              }
              return offer;
            });
            
            console.log('GLOBAL: New offers state:', updatedOffers);
            return updatedOffers;
          });

          // Also trigger a complete refresh after a short delay
          setTimeout(() => {
            console.log('GLOBAL: Triggering complete refresh');
            fetchUserOffers();
          }, 500);
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
          console.log('GLOBAL: New offer created:', payload);
          fetchUserOffers();
        }
      )
      .subscribe((status) => {
        console.log('GLOBAL: Real-time subscription status:', status);
      });

    // Also set up a channel specifically for this user's offers
    const userChannel = supabase
      .channel(`user-${user.id}-offers`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('USER CHANNEL: Offer change detected:', payload);
          fetchUserOffers();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(userChannel);
    };
  }, [user]);

  // More frequent refresh to ensure data consistency
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('Periodic refresh of offers');
      fetchUserOffers();
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Initial fetch
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
