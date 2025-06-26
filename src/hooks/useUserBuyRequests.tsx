
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
  user_id: string;
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
      console.log('Fetching buy requests for user:', user.id);
      
      const { data, error } = await supabase
        .from('buy_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching buy requests:', error);
        throw error;
      }

      console.log('Fetched buy requests:', data?.length || 0);
      
      // Additional safety check to ensure all requests belong to the current user
      const userRequests = (data || []).filter(request => request.user_id === user.id);
      
      if (userRequests.length !== (data || []).length) {
        console.warn('Some requests were filtered out for security reasons');
      }
      
      setBuyRequests(userRequests);
    } catch (err) {
      console.error('Error fetching user buy requests:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const deleteBuyRequest = async (id: string) => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      // Additional security check before deletion
      const { data: requestToDelete, error: checkError } = await supabase
        .from('buy_requests')
        .select('user_id')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error('Error checking request ownership:', checkError);
        return { success: false, error: 'Error verificando permisos' };
      }

      if (requestToDelete.user_id !== user.id) {
        console.error('Attempt to delete request from another user:', id);
        return { success: false, error: 'No tienes permisos para eliminar esta solicitud' };
      }

      const { error } = await supabase
        .from('buy_requests')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Double check with user_id

      if (error) {
        console.error('Error deleting buy request:', error);
        throw error;
      }
      
      // Update the local list
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
