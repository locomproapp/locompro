
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserOffer } from '@/types/userOffer';
import { useOfferStatusEvents } from '@/hooks/useOfferStatusEvents';
import { useOfferRealtime } from '@/hooks/useOfferRealtime';
import { usePeriodicRefresh } from '@/hooks/usePeriodicRefresh';

export const useUserOffers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<UserOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOffers = useCallback(async () => {
    if (!user) {
      setOffers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching offers for seller:', user.id);
      
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          buy_requests (
            title,
            zone,
            status
          )
        `)
        .eq('seller_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }
      
      console.log('Fresh offers fetched:', data);
      
      const transformedData: UserOffer[] = (data || []).map(offer => ({
        ...offer,
        buy_requests: offer.buy_requests || null
      }));
      
      setOffers(transformedData);
    } catch (err) {
      console.error('Error fetching user offers:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Use the extracted hooks
  useOfferStatusEvents({ user, setOffers, fetchUserOffers });
  useOfferRealtime({ user, setOffers, fetchUserOffers });
  usePeriodicRefresh({ user, fetchUserOffers });

  // Initial fetch
  useEffect(() => {
    fetchUserOffers();
  }, [fetchUserOffers]);

  return {
    offers,
    loading,
    error,
    refetch: fetchUserOffers
  };
};
