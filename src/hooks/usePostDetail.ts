
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePostDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('id', id)
        .maybeSingle(); // Use maybeSingle to prevent errors when no post is found
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
};
