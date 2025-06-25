
import React from 'react';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OfferHeader from './OfferCard/OfferHeader';
import OfferContent from './OfferCard/OfferContent';
import OfferActions from './OfferCard/OfferActions';
import RejectedOfferActions from './OfferCard/RejectedOfferActions';
import OfferOwnerActions from './OfferCard/OfferOwnerActions';
import OfferChat from './OfferCard/OfferChat';

interface Offer {
  id: string;
  buy_request_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  price_history?: Array<{
    price: number;
    timestamp: string;
    type: 'rejected' | 'initial';
  }> | null;
  images: string[] | null;
  contact_info: any;
  status: string;
  rejection_reason: string | null;
  delivery_time: string | null;
  created_at: string;
  updated_at: string;
  buyer_rating?: number | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
  buy_requests?: {
    title: string;
    zone: string;
    status: string;
    user_id?: string;
  } | null;
}

interface OfferCardProps {
  offer: Offer;
  showActions?: boolean;
  showPublicInfo?: boolean;
  onStatusUpdate?: () => void;
  currentUserId?: string;
  buyRequestOwnerId?: string;
}

const OfferCard = ({ 
  offer, 
  showActions = false, 
  showPublicInfo = false, 
  onStatusUpdate, 
  currentUserId,
  buyRequestOwnerId 
}: OfferCardProps) => {
  // Determine user role more precisely
  const isSeller = currentUserId === offer.seller_id;
  const isBuyRequestOwner = currentUserId === buyRequestOwnerId || currentUserId === offer.buy_requests?.user_id;
  const shouldShowChat = offer.status === 'accepted' && currentUserId && !!offer.buy_requests;

  return (
    <div className="space-y-4">
      <Card className={`p-4 ${offer.status === 'rejected' ? 'ring-1 ring-red-200 bg-red-50' : offer.status === 'accepted' ? 'ring-1 ring-green-200 bg-green-50' : ''}`}>
        <div className="space-y-3">
          <OfferHeader offer={offer} />
          <OfferContent offer={offer} />

          {/* Status explanation for sellers */}
          {isSeller && offer.status === 'pending' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Tu oferta está pendiente. El comprador debe aceptarla o rechazarla.
              </AlertDescription>
            </Alert>
          )}

          {/* Owner actions (Edit/Delete) - for pending offers and always show delete */}
          {isSeller && (offer.status === 'pending' || offer.status === 'rejected' || offer.status === 'accepted') && (
            <OfferOwnerActions
              offerId={offer.id}
              offerTitle={offer.title}
              buyRequestId={offer.buy_request_id}
              status={offer.status}
              onUpdate={onStatusUpdate}
            />
          )}

          {/* Actions for buy request owners (accept/reject) - only for pending offers */}
          {isBuyRequestOwner && offer.status === 'pending' && (
            <OfferActions
              offerId={offer.id}
              status={offer.status}
              showActions={true}
              onStatusUpdate={onStatusUpdate}
            />
          )}

          {/* Actions for sellers (counteroffer) - only for rejected offers */}
          {isSeller && offer.status === 'rejected' && (
            <RejectedOfferActions
              offerId={offer.id}
              currentPrice={offer.price}
              buyRequestId={offer.buy_request_id}
              onStatusUpdate={onStatusUpdate}
            />
          )}
        </div>
      </Card>

      <OfferChat 
        offer={offer}
        shouldShowChat={shouldShowChat}
        isSeller={isSeller}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default OfferCard;
