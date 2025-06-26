
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
          
          queryClient.setQueryData(['chat-messages', chatId], (oldMessages: ChatMessage[] = []) => {
            // Check if message already exists to avoid duplicates
            const messageExists = oldMessages.some(msg => msg.id === newMessage.id);
            if (!messageExists) {
              console.log('Adding new message to local state:', newMessage);
              const updatedMessages = [...oldMessages, newMessage].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
              return updatedMessages;
            }
            console.log('Message already exists, skipping duplicate:', newMessage.id);
            return oldMessages;
          });

          // Also invalidate and refetch to ensure consistency
          queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          console.log('Message updated via real-time:', payload);
          const updatedMessage = payload.new as ChatMessage;
          
          queryClient.setQueryData(['chat-messages', chatId], (oldMessages: ChatMessage[] = []) => {
            return oldMessages.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            );
          });
        }
      )
      .subscribe((status) => {
        console.log('Chat real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to chat real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error with chat real-time subscription');
        }
      });

    return () => {
      console.log('Cleaning up chat real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [chatId, queryClient]);
};
