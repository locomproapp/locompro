
import { useFetchOffers } from '@/hooks/useFetchOffers';

export const useOffers = (buyRequestId?: string) => {
  const { data: offers = [], isLoading: loading, error, refetch } = useFetchOffers(buyRequestId || '');

  return {
    offers,
    loading,
    error: error?.message || null,
    refetch
  };
};
