
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
  created_at: string;
  updated_at: string;
  buy_requests: {
    title: string;
    zone: string;
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
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          buy_requests (
            title,
            zone
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
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
