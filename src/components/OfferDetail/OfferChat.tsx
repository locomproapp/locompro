
import React from 'react';
import Chat from '@/components/Chat';
import { MessageCircle } from 'lucide-react';

interface OfferChatProps {
  offer: any;
  isSeller: boolean;
}

const OfferChat = ({ offer, isSeller }: OfferChatProps) => {
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
