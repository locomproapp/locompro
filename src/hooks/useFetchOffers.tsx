
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
    user_id?: string;
  };
}

export const useFetchOffers = (buyRequestId: string) => {
  return useQuery({
    queryKey: ['offers', buyRequestId],
    queryFn: async () => {
      console.log('🔍 useFetchOffers - Starting fetch for buyRequestId:', buyRequestId);
      
      if (!buyRequestId) {
        console.log('❌ useFetchOffers - No buyRequestId provided');
        return [];
      }
      
      // Fetch ALL offers for this buy request - public visibility for everyone
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
            status,
            user_id
          )
        `)
        .eq('buy_request_id', buyRequestId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ useFetchOffers - Database error:', error);
        throw error;
      }

      console.log('✅ useFetchOffers - Raw data from database:', data);
      console.log('✅ useFetchOffers - Number of offers found:', data?.length || 0);

      if (!data || data.length === 0) {
        console.log('ℹ️ useFetchOffers - No offers found for this buy request');
        return [];
      }

      const transformedOffers: Offer[] = data.map(offer => {
        console.log('🔄 useFetchOffers - Transforming offer:', offer.id, offer.title);
        
        return {
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
            status: offer.buy_requests?.status || '',
            user_id: offer.buy_requests?.user_id || undefined
          }
        };
      });

      console.log('✅ useFetchOffers - Transformed offers:', transformedOffers.length, 'offers');
      return transformedOffers;
    },
    enabled: !!buyRequestId,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0
  });
};
