
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBuyRequestDetail = (id: string) => {
  return useQuery({
    queryKey: ['buy-request', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('buy_requests')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            bio,
            location,
            email
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
};
