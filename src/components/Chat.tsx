
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatProps {
  buyRequestId: string;
  sellerId: string;
  offerId: string;
}

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

const Chat = ({ buyRequestId, sellerId, offerId }: ChatProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Crear o obtener el chat
  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ['chat', buyRequestId, sellerId],
    queryFn: async () => {
      if (!user) return null;

      // Intentar obtener chat existente
      const { data: existingChat } = await supabase
        .from('chats')
        .select('*')
        .eq('buy_request_id', buyRequestId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .single();

      if (existingChat) return existingChat;

      // Crear nuevo chat si no existe
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

  // Obtener mensajes del chat
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

  // Suscribirse a nuevos mensajes en tiempo real
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

  // Scroll automático a los nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar mensaje
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
      setNewMessage('');
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (chatLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-4">
            <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Iniciando chat...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Chat con el vendedor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 overflow-y-auto p-4 space-y-3">
          {messagesLoading ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Cargando mensajes...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                ¡Inicia la conversación con el vendedor!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 opacity-70`}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Chat;
