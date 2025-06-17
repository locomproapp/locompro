
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Offer {
  id: string;
  title: string;
  description: string | null;
  price: number;
  delivery_time: string | null;
  contact_info: any;
  images: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  seller_id: string;
  buy_request_id: string;
  message: string | null;
  rejection_reason: string | null;
  buyer_rating: number | null;
  public_visibility: boolean | null;
  price_history: Array<{ price: number; timestamp: string; type: 'initial' | 'rejected' }> | null;
  profiles: {
    full_name: string;
    email: string;
  };
  buy_requests: {
    title: string;
    zone: string;
    status: string;
  } | null;
}

export const useFetchOffers = (buyRequestId: string) => {
  return useQuery({
    queryKey: ['offers', buyRequestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          profiles!inner (
            full_name,
            email
          ),
          buy_requests!inner (
            title,
            zone,
            status
          )
        `)
        .eq('buy_request_id', buyRequestId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }

      const transformedOffers: Offer[] = (data || []).map(offer => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        delivery_time: offer.delivery_time,
        contact_info: offer.contact_info,
        images: offer.images,
        status: offer.status,
        created_at: offer.created_at,
        updated_at: offer.updated_at,
        seller_id: offer.seller_id,
        buy_request_id: offer.buy_request_id,
        message: offer.message,
        rejection_reason: offer.rejection_reason,
        buyer_rating: offer.buyer_rating,
        public_visibility: offer.public_visibility,
        price_history: Array.isArray(offer.price_history) ? offer.price_history as Array<{ price: number; timestamp: string; type: 'initial' | 'rejected' }> : null,
        profiles: offer.profiles,
        buy_requests: offer.buy_requests || { title: 'Solicitud eliminada', zone: 'N/A', status: 'inactive' }
      }));

      return transformedOffers;
    },
    enabled: !!buyRequestId
  });
};
