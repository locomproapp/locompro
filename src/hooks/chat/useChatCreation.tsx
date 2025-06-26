
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Chat } from './types';

export const useChatCreation = (buyRequestId: string, sellerId: string, offerId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['chat', buyRequestId, sellerId, user?.id],
    queryFn: async (): Promise<Chat | null> => {
      if (!user) return null;

      console.log('Creating/getting chat for:', { buyRequestId, sellerId, buyerId: user.id });

      // First, get the buy request to determine who is the buyer
      const { data: buyRequest, error: buyRequestError } = await supabase
        .from('buy_requests')
        .select('user_id')
        .eq('id', buyRequestId)
        .single();

      if (buyRequestError) {
        console.error('Error fetching buy request:', buyRequestError);
        throw buyRequestError;
      }

      const actualBuyerId = buyRequest.user_id;
      
      console.log('Buy request owner (buyer):', actualBuyerId);
      console.log('Current user:', user.id);
      console.log('Seller:', sellerId);

      // Try to get existing chat between the buyer and seller for this buy request
      const { data: existingChat } = await supabase
        .from('chats')
        .select('*')
        .eq('buy_request_id', buyRequestId)
        .eq('buyer_id', actualBuyerId)
        .eq('seller_id', sellerId)
        .single();

      if (existingChat) {
        console.log('Found existing chat:', existingChat);
        return existingChat;
      }

      // Only create a new chat if the current user is either the buyer or the seller
      if (user.id !== actualBuyerId && user.id !== sellerId) {
        console.log('User is neither buyer nor seller, cannot access chat');
        return null;
      }

      // Create new chat if it doesn't exist
      console.log('Creating new chat');
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({
          buy_request_id: buyRequestId,
          buyer_id: actualBuyerId,
          seller_id: sellerId,
          offer_id: offerId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chat:', error);
        throw error;
      }
      
      console.log('Created new chat:', newChat);
      return newChat;
    },
    enabled: !!user && !!buyRequestId && !!sellerId && !!offerId,
    staleTime: 60000, // Consider chat data fresh for 1 minute
    gcTime: 300000 // Keep in cache for 5 minutes
  });
};
