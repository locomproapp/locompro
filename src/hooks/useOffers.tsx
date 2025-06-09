
import { useState, useEffect } from 'react';
import { Offer } from '@/types/offer';
import { useOffersRealtime } from '@/hooks/useOffersRealtime';
import { useFetchOffers } from '@/hooks/useFetchOffers';

export const useOffers = (buyRequestId?: string) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchOffers } = useFetchOffers({
    buyRequestId,
    setOffers,
    setLoading,
    setError
  });

  // Use the extracted real-time hook
  useOffersRealtime({ buyRequestId, setOffers, fetchOffers });

  useEffect(() => {
    if (buyRequestId) {
      fetchOffers();
    }
  }, [buyRequestId, fetchOffers]);

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  };
};
