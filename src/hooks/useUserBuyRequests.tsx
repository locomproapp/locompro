
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
  profiles?: {
    full_name: string | null;
    email?: string | null;
  } | null;
}

export const useUserBuyRequests = () => {
  const { user } = useAuth();
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBuyRequests = async () => {
    if (!user) {
      console.log('No user logged in, clearing buy requests');
      setBuyRequests([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching buy requests for user:', user.id);
      
      const { data, error } = await supabase
        .from('buy_requests')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching buy requests:', error);
        throw error;
      }

      console.log('Raw fetched data with profiles:', data);
      
      // Strict filtering - only show requests that belong to the current user
      const userRequests = (data || []).filter(request => {
        const isOwner = request.user_id === user.id;
        console.log(`Request ${request.id}: user_id=${request.user_id}, current_user=${user.id}, isOwner=${isOwner}`);
        return isOwner;
      });
      
      console.log('Filtered user requests:', userRequests.length);
      
      // Additional security check - if any request doesn't belong to user, log it
      const invalidRequests = (data || []).filter(request => request.user_id !== user.id);
      if (invalidRequests.length > 0) {
        console.error('WARNING: Found requests that do not belong to current user:', invalidRequests);
      }
      
      setBuyRequests(userRequests);
    } catch (err) {
      console.error('Error fetching user buy requests:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setBuyRequests([]); // Clear requests on error
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
      
      // Update the local list - only remove if it actually belonged to the user
      setBuyRequests(prev => prev.filter(request => request.id !== id && request.user_id === user.id));
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
