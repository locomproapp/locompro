
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
      console.log('🔍 Fetching buy requests with profile data...');
      
      let query = supabase
        .from('buy_requests')
        .select(`
          *,
          profiles!inner (
            full_name,
            avatar_url,
            location
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching buy requests:', error);
        throw error;
      }
      
      console.log(`✅ Fetched ${data?.length || 0} buy requests`);
      console.log('📋 Sample profile data:', data?.[0]?.profiles);
      
      // Filter out any requests without valid profile data
      const validRequests = (data || []).filter(request => 
        request.profiles && 
        request.profiles.full_name && 
        request.profiles.full_name.trim() !== ''
      );
      
      console.log(`📋 Valid requests with profiles: ${validRequests.length}`);
      
      const transformedData: BuyRequest[] = validRequests.map(request => ({
        id: request.id,
        title: request.title,
        description: request.description,
        min_price: request.min_price,
        max_price: request.max_price,
        reference_image: request.reference_image,
        zone: request.zone,
        status: request.status,
        created_at: request.created_at,
        profiles: request.profiles
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
