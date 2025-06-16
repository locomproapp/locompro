
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserPostDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['user-post', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('user_posts')
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
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
};
