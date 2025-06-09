
import { useEffect } from 'react';
import { UserOffer } from '@/types/userOffer';

interface UseOfferStatusEventsProps {
  user: any;
  setOffers: React.Dispatch<React.SetStateAction<UserOffer[]>>;
  fetchUserOffers: () => Promise<void>;
}

export const useOfferStatusEvents = ({ user, setOffers, fetchUserOffers }: UseOfferStatusEventsProps) => {
  useEffect(() => {
    if (!user) return;

    console.log('Setting up enhanced global event listener for offer status changes');

    const handleOfferStatusChange = (event: CustomEvent) => {
      const { offerId, newStatus, rejectionReason } = event.detail;
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
  }, [user, setOffers, fetchUserOffers]);
};
