
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserOffer } from '@/types/userOffer';
import { useOfferRefresh } from '@/hooks/useOfferRefresh';

export const useUserOffers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<UserOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOffers = useCallback(async () => {
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
        price_history: offer.price_history as Array<{
          price: number;
          timestamp: string;
          type: 'rejected' | 'initial';
        }> | null,
        buy_requests: offer.buy_requests || null
      }));
      
      setOffers(transformedData);
    } catch (err) {
      console.error('Error fetching user offers:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const { debouncedRefresh } = useOfferRefresh({ fetchUserOffers });

  // Set up real-time subscription with debounced refresh
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for user offers:', user.id);

    const channel = supabase
      .channel('offers-updates')
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
          
          // Update state immediately
          setOffers(currentOffers => {
            return currentOffers.map(offer => {
              if (offer.id === payload.new.id) {
                return { 
                  ...offer, 
                  ...payload.new,
                  price_history: payload.new.price_history as Array<{
                    price: number;
                    timestamp: string;
                    type: 'rejected' | 'initial';
                  }> | null,
                  status: payload.new.status,
                  rejection_reason: payload.new.rejection_reason,
                  updated_at: payload.new.updated_at || new Date().toISOString()
                };
              }
              return offer;
            });
          });

          // Debounced full refresh for consistency
          debouncedRefresh();
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
        () => {
          console.log('New offer created');
          debouncedRefresh();
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
        () => {
          console.log('Offer deleted');
          debouncedRefresh();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user, debouncedRefresh]);

  // Set up global event listener with debounced refresh
  useEffect(() => {
    const handleOfferStatusChange = () => {
      console.log('Global offer status change detected');
      debouncedRefresh();
    };

    window.addEventListener('offerStatusChanged', handleOfferStatusChange);

    return () => {
      window.removeEventListener('offerStatusChanged', handleOfferStatusChange);
    };
  }, [debouncedRefresh]);

  // Initial fetch
  useEffect(() => {
    fetchUserOffers();
  }, [fetchUserOffers]);

  return {
    offers,
    loading,
    error,
    refetch: debouncedRefresh
  };
};
