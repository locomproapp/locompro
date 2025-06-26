
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getDisplayNameWithCurrentUser } from '@/utils/displayName';
import CompactOfferImageCarousel from './CompactOfferImageCarousel';
import CompactOfferActions from './CompactOfferActions';
import CompactOfferOwnerActions from './CompactOfferOwnerActions';
import CompactOfferRejectionReason from './CompactOfferRejectionReason';
import CompactOfferPrice from './CompactOfferPrice';
import CompactOfferHeader from './CompactOfferHeader';
import CompactOfferDetails from './CompactOfferDetails';

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

  // Get display name with "(Yo)" for current user
  const displayName = getDisplayNameWithCurrentUser(
    offer.profiles,
    offer.seller_id,
    user?.id
  );

  return (
    <Card className={`w-80 flex-shrink-0 ${
      offer.status === 'rejected' ? 'ring-1 ring-red-200 bg-red-50' : 
      offer.status === 'accepted' ? 'ring-1 ring-green-200 bg-green-50' : ''
    }`}>
      <CardHeader className="pb-2">
        <CompactOfferHeader
          displayName={displayName}
          createdAt={offer.created_at}
          status={offer.status}
          title={offer.title}
        />
      </CardHeader>

      <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Image section */}
        <CompactOfferImageCarousel 
          images={offer.images} 
          title={offer.title} 
        />

        {/* Price and location */}
        <div className="flex items-center justify-between">
          <CompactOfferPrice 
            currentPrice={offer.price}
            priceHistory={offer.price_history}
            status={offer.status}
          />
          <CompactOfferDetails
            contactInfo={offer.contact_info}
            deliveryTime={offer.delivery_time}
            description={offer.description}
          />
        </div>

        {/* Accept/Reject Actions - only for buy request owner */}
        {canAcceptOrReject && (
          <CompactOfferActions
            offerId={offer.id}
            canAcceptOrReject={canAcceptOrReject}
            onStatusUpdate={onStatusUpdate}
          />
        )}
      </CardContent>

      {/* Rejection reason for rejected offers */}
      <CompactOfferRejectionReason 
        status={offer.status} 
        rejectionReason={offer.rejection_reason} 
      />

      {/* Edit/Delete/Counteroffer buttons - only for offer owner */}
      {isOfferOwner && (
        <CompactOfferOwnerActions
          offerId={offer.id}
          buyRequestId={offer.buy_request_id}
          status={offer.status}
          isOfferOwner={isOfferOwner}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </Card>
  );
};

export default CompactOfferCard;
