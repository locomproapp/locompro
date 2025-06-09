
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserOffer } from '@/types/userOffer';

interface UseOfferRealtimeProps {
  user: any;
  setOffers: React.Dispatch<React.SetStateAction<UserOffer[]>>;
  fetchUserOffers: () => Promise<void>;
}

export const useOfferRealtime = ({ user, setOffers, fetchUserOffers }: UseOfferRealtimeProps) => {
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
  }, [user, setOffers, fetchUserOffers]);
};
