
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Post {
  id: string;
  title: string;
  description: string | null;
  min_price: number | null;
  max_price: number | null;
  reference_url: string | null;
  zone: string;
  condition: string;
  images: string[] | null;
  reference_image: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useUserPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPosts = async () => {
    if (!user) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buy_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('buy_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Actualizar la lista local
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting post:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error desconocido' 
      };
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  return {
    posts,
    loading,
    error,
    refetch: fetchUserPosts,
    deletePost
  };
};
