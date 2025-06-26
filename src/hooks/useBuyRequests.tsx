
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
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    location: string | null;
    email: string | null;
  } | null;
}

export const useBuyRequests = (searchQuery?: string) => {
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyRequests = async () => {
    try {
      setLoading(true);
      console.log('🔍 useBuyRequests - Fetching buy requests with complete profile data...');
      
      // Use explicit join syntax to ensure we get profile data
      let query = supabase
        .from('buy_requests')
        .select(`
          id,
          title,
          description,
          min_price,
          max_price,
          reference_image,
          zone,
          status,
          created_at,
          user_id,
          profiles:user_id (
            full_name,
            avatar_url,
            location,
            email
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ useBuyRequests - Error fetching buy requests:', error);
        throw error;
      }
      
      console.log(`✅ useBuyRequests - Fetched ${data?.length || 0} buy requests`);
      
      // Enhanced logging for profile data with name resolution debugging
      data?.forEach((request, index) => {
        const displayName = request.profiles?.full_name?.trim() || 
                          request.profiles?.email?.split('@')[0] || 
                          'Usuario anónimo';
        
        console.log(`📋 useBuyRequests - Request ${index + 1}:`, {
          id: request.id,
          title: request.title,
          user_id: request.user_id,
          has_profiles: !!request.profiles,
          full_name: request.profiles?.full_name,
          email: request.profiles?.email,
          resolved_display_name: displayName,
          profile_keys: request.profiles ? Object.keys(request.profiles) : 'null'
        });
      });
      
      const transformedData: BuyRequest[] = (data || []).map(request => ({
        id: request.id,
        title: request.title,
        description: request.description,
        min_price: request.min_price,
        max_price: request.max_price,
        reference_image: request.reference_image,
        zone: request.zone,
        status: request.status,
        created_at: request.created_at,
        user_id: request.user_id,
        profiles: request.profiles
      }));
      
      setBuyRequests(transformedData);
    } catch (err) {
      console.error('❌ useBuyRequests - Error in fetchBuyRequests:', err);
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
