
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Chat } from './types';

export const useChatCreation = (buyRequestId: string, sellerId: string, offerId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['chat', buyRequestId, sellerId],
    queryFn: async (): Promise<Chat | null> => {
      if (!user) return null;

      console.log('Creating/getting chat for:', { buyRequestId, sellerId, buyerId: user.id });

      // Try to get existing chat
      const { data: existingChat } = await supabase
        .from('chats')
        .select('*')
        .eq('buy_request_id', buyRequestId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .single();

      if (existingChat) {
        console.log('Found existing chat:', existingChat);
        return existingChat;
      }

      // Create new chat if it doesn't exist
      console.log('Creating new chat');
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({
          buy_request_id: buyRequestId,
          buyer_id: user.id,
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
    enabled: !!user && !!buyRequestId && !!sellerId && !!offerId
  });
};
