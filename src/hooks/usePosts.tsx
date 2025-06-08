
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Post {
  id: string;
  title: string;
  description: string | null;
  min_price: number | null;
  max_price: number | null;
  reference_link: string | null;
  zone: string;
  contact_info: any;
  characteristics: any;
  images: string[] | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export const usePosts = (searchQuery?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchQuery]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts
  };
};
