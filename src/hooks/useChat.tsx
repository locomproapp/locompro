
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

      // Try to get existing chat
      const { data: existingChat } = await supabase
        .from('chats')
        .select('*')
        .eq('buy_request_id', buyRequestId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .single();

      if (existingChat) return existingChat;

      // Create new chat if it doesn't exist
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

      if (error) throw error;
      return newChat;
    },
    enabled: !!user && !!buyRequestId && !!sellerId && !!offerId
  });

  // Get chat messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chat-messages', chat?.id],
    queryFn: async () => {
      if (!chat?.id) return [];

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!chat?.id
  });

  // Subscribe to real-time messages
  useEffect(() => {
    if (!chat?.id) return;

    const channel = supabase
      .channel(`chat-${chat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chat.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', chat.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chat?.id, queryClient]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!chat?.id || !user) throw new Error('Chat no disponible');

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chat.id,
          sender_id: user.id,
          message: message.trim()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', chat?.id] });
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
