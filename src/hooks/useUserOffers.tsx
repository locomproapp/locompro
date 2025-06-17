
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
  };
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
        id: offer.id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        delivery_time: offer.delivery_time,
        status: offer.status,
        created_at: offer.created_at,
        updated_at: offer.updated_at,
        buy_request_id: offer.buy_request_id,
        message: offer.message,
        rejection_reason: offer.rejection_reason,
        buyer_rating: offer.buyer_rating,
        public_visibility: offer.public_visibility,
        price_history: Array.isArray(offer.price_history) ? 
          (offer.price_history as Array<{ price: number; timestamp: string; type: 'initial' | 'rejected' }>) : 
          null,
        buy_requests: offer.buy_requests as { title: string; zone: string; status: string; }
      }));

      return transformedOffers;
    },
    enabled: !!user
  });
};
