
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

  // Enhanced global event listener for immediate state updates
  useEffect(() => {
    if (!user) return;

    console.log('Setting up enhanced global event listener for offer status changes');

    const handleOfferStatusChange = (event: CustomEvent) => {
      const { offerId, newStatus, rejectionReason, timestamp } = event.detail;
      console.log('ENHANCED GLOBAL EVENT: Offer status changed detected:', { offerId, newStatus, rejectionReason });

      // Update the specific offer immediately in local state
      setOffers(currentOffers => {
        const updatedOffers = currentOffers.map(offer => {
          if (offer.id === offerId) {
            console.log('ENHANCED GLOBAL EVENT: Updating offer status from', offer.status, 'to', newStatus);
            return {
              ...offer,
              status: newStatus,
              rejection_reason: rejectionReason || offer.rejection_reason,
              updated_at: new Date().toISOString()
            };
          }
          return offer;
        });
        
        console.log('ENHANCED GLOBAL EVENT: Updated offers state:', updatedOffers);
        return updatedOffers;
      });

      // Also trigger a complete refresh to ensure data consistency
      setTimeout(() => {
        console.log('ENHANCED GLOBAL EVENT: Triggering complete refresh after status change');
        fetchUserOffers();
      }, 300);
    };

    // Add event listener
    window.addEventListener('offerStatusChanged', handleOfferStatusChange as EventListener);

    return () => {
      console.log('Cleaning up enhanced global event listener');
      window.removeEventListener('offerStatusChanged', handleOfferStatusChange as EventListener);
    };
  }, [user]);

  // Enhanced real-time subscription with better error handling
  useEffect(() => {
    if (!user) return;

    console.log('Setting up enhanced real-time subscription for user offers:', user.id);

    const channel = supabase
      .channel('enhanced-offers-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('ENHANCED RT: Real-time offer update received:', payload);
          
          // Force immediate state update
          setOffers(currentOffers => {
            const updatedOffers = currentOffers.map(offer => {
              if (offer.id === payload.new.id) {
                console.log('ENHANCED RT: Updating offer status from', offer.status, 'to', payload.new.status);
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
            
            console.log('ENHANCED RT: New offers state:', updatedOffers);
            return updatedOffers;
          });

          // Also trigger a complete refresh for consistency
          setTimeout(() => {
            console.log('ENHANCED RT: Triggering complete refresh');
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
          console.log('ENHANCED RT: New offer created:', payload);
          fetchUserOffers();
        }
      )
      .subscribe((status) => {
        console.log('ENHANCED RT: Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('ENHANCED RT: Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('ENHANCED RT: Channel error, attempting to reconnect...');
          setTimeout(() => {
            fetchUserOffers();
          }, 2000);
        }
      });

    return () => {
      console.log('Cleaning up enhanced real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  // More frequent refresh interval to ensure data consistency
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('Periodic enhanced refresh of offers');
      fetchUserOffers();
    }, 8000); // Refresh every 8 seconds

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
