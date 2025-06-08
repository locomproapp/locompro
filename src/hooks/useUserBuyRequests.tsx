
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number | null;
  max_price: number | null;
  reference_image: string | null;
  zone: string;
  status: string;
  created_at: string;
}

export const useUserBuyRequests = () => {
  const { user } = useAuth();
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBuyRequests = async () => {
    if (!user) {
      setBuyRequests([]);
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
      setBuyRequests(data || []);
    } catch (err) {
      console.error('Error fetching user buy requests:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const deleteBuyRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('buy_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Actualizar la lista local
      setBuyRequests(prev => prev.filter(request => request.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting buy request:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
    }
  };

  useEffect(() => {
    fetchUserBuyRequests();
  }, [user]);

  return {
    buyRequests,
    loading,
    error,
    refetch: fetchUserBuyRequests,
    deleteBuyRequest
  };
};
