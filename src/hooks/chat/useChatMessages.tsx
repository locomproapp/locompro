
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage } from './types';

export const useChatMessages = (chatId: string | undefined) => {
  return useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: async (): Promise<ChatMessage[]> => {
      if (!chatId) return [];

      console.log('Fetching messages for chat:', chatId);

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      console.log('Fetched messages:', data);
      return data as ChatMessage[];
    },
    enabled: !!chatId,
    refetchInterval: 5000, // Increased polling interval as backup
    staleTime: 1000, // Consider data stale after 1 second
    gcTime: 30000 // Keep in cache for 30 seconds
  });
};
