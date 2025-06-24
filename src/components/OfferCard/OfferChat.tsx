
import React from 'react';
import { MessageCircle } from 'lucide-react';
import Chat from '@/components/Chat';

interface OfferChatProps {
  offer: {
    id: string;
    buy_request_id: string;
    seller_id: string;
    status: string;
    buy_requests?: {
      title: string;
      zone: string;
      status: string;
    } | null;
  };
  shouldShowChat: boolean;
  isSeller: boolean;
  currentUserId?: string;
}

const OfferChat = ({ offer, shouldShowChat, isSeller }: OfferChatProps) => {
  if (!shouldShowChat) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-green-600" />
        <h4 className="font-medium text-green-800">
          {isSeller ? '¡Oferta aceptada! Chatea con el comprador' : '¡Oferta aceptada! Chatea con el vendedor'}
        </h4>
      </div>
      <Chat 
        buyRequestId={offer.buy_request_id}
        sellerId={offer.seller_id}
        offerId={offer.id}
      />
    </div>
  );
};

export default OfferChat;
