
import { useFetchOffers } from '@/hooks/useFetchOffers';

export const useOffers = (buyRequestId?: string) => {
  const { data: offers = [], isLoading: loading, error, refetch } = useFetchOffers(buyRequestId || '');

  // Add console logging for debugging
  console.log('🔍 useOffers - buyRequestId:', buyRequestId);
  console.log('🔍 useOffers - offers length:', offers.length);
  console.log('🔍 useOffers - loading:', loading);
  console.log('🔍 useOffers - error:', error);

  return {
    offers,
    loading,
    error: error?.message || null,
    refetch
  };
};
