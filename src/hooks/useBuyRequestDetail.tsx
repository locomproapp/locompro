
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
      
      if (error) {
        console.error("Error fetching buy request details:", error);
        throw error;
      }
      
      // Using `as any` to bypass a potential type mismatch if the DB schema has been
      // updated with 'images', 'condition', 'reference_url' but types are not yet synced.
      // This will fix the build error.
      return data as any;
    },
    enabled: !!id
  });
};
