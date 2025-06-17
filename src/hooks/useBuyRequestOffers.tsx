
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BuyRequestOffer } from '@/types/buyRequestOffer';

export const useBuyRequestOffers = (buyRequestId: string) => {
  const [offers, setOffers] = useState<BuyRequestOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      
      // First get the offers
      const { data: offersData, error: offersError } = await supabase
        .from('buy_request_offers')
        .select('*')
        .eq('buy_request_id', buyRequestId)
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      if (!offersData || offersData.length === 0) {
        setOffers([]);
        setError(null);
        return;
      }

      // Get unique seller IDs
      const sellerIds = [...new Set(offersData.map(offer => offer.seller_id))];

      // Get profiles for all sellers
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', sellerIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles by ID
      const profilesMap = new Map();
      (profilesData || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Transform the data to match our interface
      const transformedData = offersData.map(offer => ({
        ...offer,
        status: offer.status as 'pending' | 'accepted' | 'rejected' | 'finalized',
        profiles: profilesMap.get(offer.seller_id) || null
      }));
      
      setOffers(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (buyRequestId) {
      fetchOffers();
    }
  }, [buyRequestId]);

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers
  };
};
