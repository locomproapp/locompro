
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to new messages only within the chat container
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      // Only scroll within the messages container, not the entire page
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">Cargando mensajes...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          ¡Inicia la conversación!
        </p>
      </div>
    );
  }

  console.log('Rendering messages:', messages.length, 'Current user:', user?.id);

  return (
    <div ref={messagesContainerRef} className="space-y-3">
      {messages.map((message) => {
        const isOwnMessage = message.sender_id === user?.id;
        console.log('Message:', message.id, 'Sender:', message.sender_id, 'Is own:', isOwnMessage);
        
        return (
          <div
            key={message.id}
            className={`flex gap-2 ${
              isOwnMessage ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 ${
                isOwnMessage
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
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
