
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
}

export const useChat = (buyRequestId: string, sellerId: string, offerId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Create or get chat
  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ['chat', buyRequestId, sellerId],
    queryFn: async () => {
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

  // Get chat messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chat-messages', chat?.id],
    queryFn: async () => {
      if (!chat?.id) return [];

      console.log('Fetching messages for chat:', chat.id);

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      console.log('Fetched messages:', data);
      return data as ChatMessage[];
    },
    enabled: !!chat?.id,
    refetchInterval: 1000 // More frequent polling as backup
  });

  // Subscribe to real-time messages
  useEffect(() => {
    if (!chat?.id) return;

    console.log('Setting up real-time subscription for chat:', chat.id);

    const channel = supabase
      .channel(`chat-messages-${chat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chat.id}`
        },
        (payload) => {
          console.log('New message received via real-time:', payload);
          const newMessage = payload.new as ChatMessage;
          
          // Immediately invalidate and refetch messages to ensure sync
          queryClient.invalidateQueries({ queryKey: ['chat-messages', chat.id] });
          
          // Also optimistically update to show message immediately
          queryClient.setQueryData(['chat-messages', chat.id], (oldMessages: ChatMessage[] = []) => {
            // Check if message already exists to avoid duplicates
            const messageExists = oldMessages.some(msg => msg.id === newMessage.id);
            if (!messageExists) {
              return [...oldMessages, newMessage];
            }
            return oldMessages;
          });
        }
      )
      .subscribe((status) => {
        console.log('Chat real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up chat real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [chat?.id, queryClient]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!chat?.id || !user) {
        console.error('Cannot send message: missing chat or user');
        throw new Error('Chat no disponible');
      }

      console.log('Sending message:', { chatId: chat.id, senderId: user.id, message });

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chat.id,
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
      console.log('Message mutation successful');
      // Force a refetch to ensure messages are synchronized
      queryClient.invalidateQueries({ queryKey: ['chat-messages', chat?.id] });
      
      // Optimistically update the local state immediately
      queryClient.setQueryData(['chat-messages', chat?.id], (oldMessages: ChatMessage[] = []) => {
        const messageExists = oldMessages.some(msg => msg.id === data.id);
        if (!messageExists) {
          return [...oldMessages, data];
        }
        return oldMessages;
      });
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

  return {
    chat,
    messages,
    chatLoading,
    messagesLoading,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending
  };
};
