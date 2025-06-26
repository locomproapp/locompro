
import React from 'react';
import { CardContent } from '@/components/ui/card';
import ChatMessages from '@/components/Chat/ChatMessages';
import MessageInput from '@/components/Chat/MessageInput';

interface ChatMessage {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface ChatContainerProps {
  messages: ChatMessage[];
  messagesLoading: boolean;
  sendMessage: (message: string) => void;
  isSending: boolean;
}

const ChatContainer = ({ messages, messagesLoading, sendMessage, isSending }: ChatContainerProps) => {
  return (
    <CardContent className="p-0">
      <div className="h-80 overflow-y-auto p-4 bg-gray-50">
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
  );
};

export default ChatContainer;
