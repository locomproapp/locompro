
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBuyRequestDetail = (id: string) => {
  return useQuery({
    queryKey: ['buy-request', id],
    queryFn: async () => {
      if (!id) return null;
      
      console.log('Fetching buy request detail for ID:', id);
      
      const { data, error } = await supabase
        .from('buy_requests')
        .select(`
          *,
          profiles (
            full_name,
            email,
            avatar_url,
            location
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching buy request:', error);
        throw error;
      }
      
      console.log('Buy request data fetched:', data);
      console.log('Profile data:', data?.profiles);
      
      return data;
    },
    enabled: !!id
  });
};
