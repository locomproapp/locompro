
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BuyRequestOffer } from '@/types/buyRequestOffer';

export const useBuyRequestOffers = (buyRequestId: string) => {
  const [offers, setOffers] = useState<BuyRequestOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buy_request_offers')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('buy_request_id', buyRequestId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (buyRequestId) {
      fetchOffers();
    }
  }, [buyRequestId]);

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  };
};
