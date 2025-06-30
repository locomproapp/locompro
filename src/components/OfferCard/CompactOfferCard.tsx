
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getDisplayNameWithCurrentUser } from '@/utils/displayName';
import CompactOfferHeader from './CompactOfferHeader';
import CompactOfferDetails from './CompactOfferDetails';
import CompactOfferActionSection from './CompactOfferActionSection';
import Chat from '@/components/Chat';

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

interface CompactOfferCardProps {
  offer: Offer;
  buyRequestOwnerId?: string;
  onStatusUpdate?: () => void;
}

const CompactOfferCard = ({ offer, buyRequestOwnerId, onStatusUpdate }: CompactOfferCardProps) => {
  const { user } = useAuth();

  // Determine user permissions
  const isBuyRequestOwner = user?.id === buyRequestOwnerId;
  const isOfferOwner = user?.id === offer.seller_id;
  const canAcceptOrReject = isBuyRequestOwner && offer.status === 'pending';
  const shouldShowChat = offer.status === 'accepted' && user && (isBuyRequestOwner || isOfferOwner);

  // Get display name with "(Yo)" for current user
  const displayName = getDisplayNameWithCurrentUser(
    offer.profiles,
    offer.seller_id,
    user?.id
  );

  const getCardClassName = () => {
    switch (offer.status) {
      case 'accepted':
        return 'ring-1 ring-green-200 bg-green-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
      case 'finalized':
        return 'ring-1 ring-gray-200 bg-gray-50';
      default:
        return '';
    }
  };

  // For rejected offers owned by current user, don't show separate action buttons since they're in the description space
  const shouldShowSeparateActions = (canAcceptOrReject || isOfferOwner) && !(offer.status === 'rejected' && isOfferOwner);

  return (
    <div className="space-y-4 w-full min-w-[260px] max-w-[260px] md:min-w-[320px] md:max-w-[320px]">
      <Card className={`w-full flex-shrink-0 flex flex-col border ${getCardClassName()} max-h-[400px]`}>
        <CardHeader className="pb-2 flex-shrink-0">
          <CompactOfferHeader
            displayName={displayName}
            createdAt={offer.created_at}
            title={offer.title}
            status={offer.status}
          />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4 pt-0 min-h-0 justify-between overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CompactOfferDetails
              images={offer.images}
              title={offer.title}
              price={offer.price}
              priceHistory={offer.price_history}
              status={offer.status}
              contactInfo={offer.contact_info}
              deliveryTime={offer.delivery_time}
              description={offer.description}
              offerId={offer.id}
              buyRequestId={offer.buy_request_id}
              isOfferOwner={isOfferOwner}
              onStatusUpdate={onStatusUpdate}
            />
          </div>
          
          {/* Action buttons pushed to bottom with consistent spacing - only for non-rejected owner offers */}
          {shouldShowSeparateActions && (
            <div className="mt-6 pt-4 border-t border-border/20 flex-shrink-0">
              <CompactOfferActionSection
                canAcceptOrReject={canAcceptOrReject}
                isOfferOwner={isOfferOwner}
                offerId={offer.id}
                buyRequestId={offer.buy_request_id}
                status={offer.status}
                onStatusUpdate={onStatusUpdate}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejection reason - separate box below the main card */}
      {offer.status === 'rejected' && offer.rejection_reason && (
        <div className="w-full max-w-[260px] md:max-w-[320px] bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-medium text-red-800 mb-1">Motivo del rechazo:</p>
          <p className="text-xs text-red-700">{offer.rejection_reason}</p>
        </div>
      )}

      {/* Chat section for accepted offers - matches full width of container/table */}
      {shouldShowChat && (
        <div className="w-full max-w-none bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-800">
              {isOfferOwner ? '¡Oferta aceptada! Chatea con el comprador' : '¡Oferta aceptada! Chatea con el vendedor'}
            </h4>
          </div>
          <div className="w-full">
            <Chat 
              buyRequestId={offer.buy_request_id}
              sellerId={offer.seller_id}
              offerId={offer.id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactOfferCard;
