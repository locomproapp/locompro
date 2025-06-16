
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserOffer {
  id: string;
  title: string;
  description: string | null;
  price: number;
  delivery_time: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  buy_request_id: string;
  message: string | null;
  rejection_reason: string | null;
  buyer_rating: number | null;
  public_visibility: boolean | null;
  price_history: Array<{ price: number; timestamp: string; type: 'initial' | 'rejected' }> | null;
  buy_requests: {
    title: string;
    zone: string;
    status: string;
  } | null;
}

export const useUserOffers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-offers', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          buy_requests!inner (
            title,
            zone,
            status
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOffers: UserOffer[] = (data || []).map(offer => ({
        ...offer,
        buy_requests: offer.buy_requests || { title: 'Solicitud eliminada', zone: 'N/A', status: 'inactive' }
      }));

      return transformedOffers;
    },
    enabled: !!user
  });
};
