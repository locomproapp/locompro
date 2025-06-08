
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Offer {
  id: string;
  buy_request_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  contact_info: any;
  status: string;
  created_at: string;
  updated_at: string;
  buyer_rating?: number | null;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
  buy_requests?: {
    title: string;
    zone: string;
  } | null;
}

export const useOffers = (buyRequestId?: string) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
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
            zone
          )
        `)
        .order('created_at', { ascending: false });

      if (buyRequestId) {
        query = query.eq('buy_request_id', buyRequestId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
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
  };

  useEffect(() => {
    fetchOffers();
  }, [buyRequestId]);

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  };
};
