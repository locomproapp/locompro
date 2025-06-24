
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBuyRequestDetail = (id: string) => {
  return useQuery({
    queryKey: ['buy-request', id],
    queryFn: async () => {
      if (!id) return null;
      
      console.log('🔍 Fetching buy request detail with full profile data for ID:', id);
      
      const { data, error } = await supabase
        .from('buy_requests')
        .select(`
          *,
          profiles!buy_requests_user_id_fkey (
            full_name,
            email,
            avatar_url,
            location,
            bio
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error fetching buy request:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('⚠️ No buy request found with ID:', id);
        throw new Error('Buy request not found');
      }
      
      console.log('✅ Buy request detail fetched:', {
        id: data.id,
        title: data.title,
        user_id: data.user_id,
        has_profiles: !!data.profiles,
        profile_data: data.profiles,
        full_name: data.profiles?.full_name
      });
      
      return data;
    },
    enabled: !!id
  });
};
