
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Offer } from '@/types/offer';

interface UseOffersRealtimeProps {
  buyRequestId: string | undefined;
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  fetchOffers: () => Promise<void>;
}

export const useOffersRealtime = ({ buyRequestId, setOffers, fetchOffers }: UseOffersRealtimeProps) => {
  useEffect(() => {
    if (!buyRequestId) return;

    console.log('Setting up real-time subscription for offers on buy request:', buyRequestId);

    const channel = supabase
      .channel(`offers-${buyRequestId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'offers',
          filter: `buy_request_id=eq.${buyRequestId}`
        },
        (payload) => {
          console.log('Real-time offer update for buy request:', payload);
          
          // Update the specific offer immediately
          setOffers(currentOffers => 
            currentOffers.map(offer => 
              offer.id === payload.new.id 
                ? { ...offer, ...payload.new }
                : offer
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'offers',
          filter: `buy_request_id=eq.${buyRequestId}`
        },
        (payload) => {
          console.log('New offer created for buy request:', payload);
          fetchOffers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'offers',
          filter: `buy_request_id=eq.${buyRequestId}`
        },
        (payload) => {
          console.log('Offer deleted for buy request:', payload);
          fetchOffers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [buyRequestId, setOffers, fetchOffers]);
};
