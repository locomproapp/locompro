
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBuyRequestDetail = (id: string) => {
  return useQuery({
    queryKey: ['buy-request', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buy_requests')
        .select(`
          *,
          categories (name),
          profiles (
            full_name,
            avatar_url,
            bio,
            location
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
