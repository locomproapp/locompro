
import React from 'react';
import { Card } from '@/components/ui/card';
import { useChat } from '@/hooks/useChat';
import ChatLoading from '@/components/Chat/ChatLoading';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatContainer from '@/components/Chat/ChatContainer';

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
    return <ChatLoading />;
  }

  return (
    <Card>
      <ChatHeader />
      <ChatContainer
        messages={messages}
        messagesLoading={messagesLoading}
        sendMessage={sendMessage}
        isSending={isSending}
      />
    </Card>
  );
};

export default Chat;
