
import { useChatCreation } from './chat/useChatCreation';
import { useChatMessages } from './chat/useChatMessages';
import { useChatRealtimeSubscription } from './chat/useChatRealtimeSubscription';
import { useSendMessage } from './chat/useSendMessage';

export const useChat = (buyRequestId: string, sellerId: string, offerId: string) => {
  // Create or get chat
  const { data: chat, isLoading: chatLoading } = useChatCreation(buyRequestId, sellerId, offerId);

  // Get chat messages
  const { data: messages = [], isLoading: messagesLoading } = useChatMessages(chat?.id);

  // Subscribe to real-time messages
  useChatRealtimeSubscription(chat?.id);

  // Send message mutation
  const sendMessageMutation = useSendMessage(chat?.id);

  return {
    chat,
    messages,
    chatLoading,
    messagesLoading,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending
  };
};
