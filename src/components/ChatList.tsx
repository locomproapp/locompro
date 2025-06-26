
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';
import { getDisplayNameWithCurrentUser } from '@/utils/displayName';

interface ChatListProps {
  onChatSelect?: (chatId: string) => void;
}

const ChatList = ({ onChatSelect }: ChatListProps) => {
  const { user } = useAuth();

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ['user-chats', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get the chats for the user
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (chatError) throw chatError;
      if (!chatData || chatData.length === 0) return [];

      // Get all unique user IDs to fetch profiles
      const userIds = new Set<string>();
      const buyRequestIds = new Set<string>();
      
      chatData.forEach(chat => {
        userIds.add(chat.buyer_id);
        userIds.add(chat.seller_id);
        buyRequestIds.add(chat.buy_request_id);
      });

      // Fetch profiles for all users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', Array.from(userIds));

      if (profileError) throw profileError;

      // Fetch buy requests
      const { data: buyRequests, error: buyRequestError } = await supabase
        .from('buy_requests')
        .select('id, title')
        .in('id', Array.from(buyRequestIds));

      if (buyRequestError) throw buyRequestError;

      // Fetch offers to get titles if buy request doesn't have one
      const offerIds = chatData.map(chat => chat.offer_id).filter(Boolean);
      let offers = [];
      if (offerIds.length > 0) {
        const { data: offerData, error: offerError } = await supabase
          .from('offers')
          .select('id, title')
          .in('id', offerIds);

        if (offerError) throw offerError;
        offers = offerData || [];
      }

      // Create lookup maps
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const buyRequestMap = new Map(buyRequests?.map(br => [br.id, br]) || []);
      const offerMap = new Map(offers.map(o => [o.id, o]));

      // Combine data
      return chatData.map(chat => ({
        ...chat,
        buyer_profile: profileMap.get(chat.buyer_id) || null,
        seller_profile: profileMap.get(chat.seller_id) || null,
        buy_requests: buyRequestMap.get(chat.buy_request_id) || null,
        offers: chat.offer_id ? offerMap.get(chat.offer_id) || null : null
      }));
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-center">Cargando chats...</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">No tienes chats activos</p>
        <p className="text-xs text-muted-foreground mt-1">
          Los chats aparecerán cuando aceptes o te acepten una oferta
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      <h3 className="font-semibold text-lg">Mis Chats</h3>
      {chats.map((chat) => {
        const isUserBuyer = user?.id === chat.buyer_id;
        const otherProfile = isUserBuyer ? chat.seller_profile : chat.buyer_profile;
        const displayName = getDisplayNameWithCurrentUser(
          otherProfile,
          isUserBuyer ? chat.seller_id : chat.buyer_id,
          user?.id
        );
        
        return (
          <Card 
            key={chat.id} 
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onChatSelect?.(chat.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={undefined} alt={displayName} />
                  <AvatarFallback>
                    {displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">
                    {displayName || 'Usuario anónimo'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {isUserBuyer ? 'Vendedor' : 'Comprador'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {chat.buy_requests?.title || chat.offers?.title || 'Producto'}
              </p>
              <p className="text-xs text-muted-foreground">
                Última actividad: {new Date(chat.updated_at).toLocaleDateString('es-AR')}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ChatList;
