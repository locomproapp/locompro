
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { ChatMessage } from './types';

export const useSendMessage = (chatId: string | undefined) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string): Promise<ChatMessage> => {
      if (!chatId || !user) {
        console.error('Cannot send message: missing chat or user');
        throw new Error('Chat no disponible');
      }

      console.log('Sending message:', { chatId, senderId: user.id, message });

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          message: message.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      console.log('Message sent successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Message mutation successful, updating local state');
      
      // Optimistically update the local state for instant feedback
      queryClient.setQueryData(['chat-messages', chatId], (oldMessages: ChatMessage[] = []) => {
        const messageExists = oldMessages.some(msg => msg.id === data.id);
        if (!messageExists) {
          console.log('Adding sent message to local state:', data);
          const updatedMessages = [...oldMessages, data].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          return updatedMessages;
        }
        console.log('Sent message already exists in local state');
        return oldMessages;
      });

      // Also trigger a refetch to ensure consistency
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
      }, 500);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
    }
  });
};
