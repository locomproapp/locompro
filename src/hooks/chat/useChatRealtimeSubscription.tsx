
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage } from './types';

export const useChatRealtimeSubscription = (chatId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId) return;

    console.log('Setting up real-time subscription for chat:', chatId);

    const channel = supabase
      .channel(`chat-messages-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          console.log('New message received via real-time:', payload);
          const newMessage = payload.new as ChatMessage;
          
          // Optimistically update the query data
          queryClient.setQueryData(['chat-messages', chatId], (oldMessages: ChatMessage[] = []) => {
            // Check if message already exists to avoid duplicates
            const messageExists = oldMessages.some(msg => msg.id === newMessage.id);
            if (!messageExists) {
              return [...oldMessages, newMessage];
            }
            return oldMessages;
          });
          
          // Also trigger a refetch to ensure synchronization
          queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
        }
      )
      .subscribe((status) => {
        console.log('Chat real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up chat real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [chatId, queryClient]);
};
