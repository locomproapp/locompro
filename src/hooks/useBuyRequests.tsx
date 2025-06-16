
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number;
  max_price: number;
  reference_image: string | null;
  zone: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

export const useBuyRequests = (searchQuery?: string) => {
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyRequests = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('buy_requests')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const transformedData: BuyRequest[] = (data || []).map(request => ({
        ...request,
        profiles: request.profiles || null
      }));
      
      setBuyRequests(transformedData);
    } catch (err) {
      console.error('Error fetching buy requests:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyRequests();
  }, [searchQuery]);

  return {
    buyRequests,
    loading,
    error,
    refetch: fetchBuyRequests
  };
};
