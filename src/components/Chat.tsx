
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import ChatMessages from '@/components/Chat/ChatMessages';
import MessageInput from '@/components/Chat/MessageInput';

interface ChatProps {
  buyRequestId: string;
  sellerId: string;
  offerId: string;
}

const Chat = ({ buyRequestId, sellerId, offerId }: ChatProps) => {
  const {
    chat,
    messages,
    chatLoading,
    messagesLoading,
    sendMessage,
    isSending
  } = useChat(buyRequestId, sellerId, offerId);

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
        <div className="h-64 overflow-y-auto p-4">
          <ChatMessages 
            messages={messages}
            isLoading={messagesLoading}
          />
        </div>

        <MessageInput 
          onSendMessage={sendMessage}
          isSending={isSending}
        />
      </CardContent>
    </Card>
  );
};

export default Chat;
