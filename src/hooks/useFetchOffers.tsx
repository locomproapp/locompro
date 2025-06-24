
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
    location?: string;
  };
  buy_requests: {
    title: string;
    zone: string;
    status: string;
  };
}

export const useFetchOffers = (buyRequestId: string) => {
  return useQuery({
    queryKey: ['offers', buyRequestId],
    queryFn: async () => {
      console.log('🔍 Fetching offers for buy request:', buyRequestId);
      
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          profiles!offers_seller_id_fkey (
            full_name,
            email,
            location
          ),
          buy_requests!offers_buy_request_id_fkey (
            title,
            zone,
            status
          )
        `)
        .eq('buy_request_id', buyRequestId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching offers:', error);
        throw error;
      }

      console.log('✅ Offers data fetched:', data);

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
        price_history: Array.isArray(offer.price_history) ? 
          (offer.price_history as Array<{ price: number; timestamp: string; type: 'initial' | 'rejected' }>) : 
          null,
        profiles: {
          full_name: offer.profiles?.full_name || 'Usuario anónimo',
          email: offer.profiles?.email || '',
          location: offer.profiles?.location || undefined
        },
        buy_requests: {
          title: offer.buy_requests?.title || '',
          zone: offer.buy_requests?.zone || '',
          status: offer.buy_requests?.status || ''
        }
      }));

      return transformedOffers;
    },
    enabled: !!buyRequestId,
    // Force refresh to ensure we get latest offers
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  });
};
