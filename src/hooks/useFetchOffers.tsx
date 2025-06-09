
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Offer } from '@/types/offer';

interface UseFetchOffersProps {
  buyRequestId: string | undefined;
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useFetchOffers = ({ buyRequestId, setOffers, setLoading, setError }: UseFetchOffersProps) => {
  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('offers')
        .select(`
          *,
          profiles (
            full_name,
            email
          ),
          buy_requests (
            title,
            zone,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (buyRequestId) {
        query = query.eq('buy_request_id', buyRequestId);
      }

      console.log('Fetching offers for buy request:', buyRequestId);
      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Offers fetched successfully:', data);
      
      const transformedData: Offer[] = (data || []).map(offer => ({
        ...offer,
        profiles: offer.profiles || null,
        buy_requests: offer.buy_requests || null
      }));
      
      setOffers(transformedData);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [buyRequestId, setOffers, setLoading, setError]);

  return { fetchOffers };
};
