
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import CompactOfferHeader from './CompactOfferHeader';
import CompactOfferPricing from './CompactOfferPricing';
import CompactOfferDetails from './CompactOfferDetails';
import CompactOfferImageCarousel from './CompactOfferImageCarousel';
import CompactOfferActions from './CompactOfferActions';
import CompactOfferOwnerActions from './CompactOfferOwnerActions';
import CompactOfferRejectionReason from './CompactOfferRejectionReason';

interface Offer {
  id: string;
  buy_request_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
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

  return (
    <Card className={`w-80 flex-shrink-0 flex flex-col ${
      offer.status === 'rejected' ? 'ring-1 ring-red-200 bg-red-50' : 
      offer.status === 'accepted' ? 'ring-1 ring-green-200 bg-green-50' : ''
    }`}>
      <CardHeader className="pb-2">
        <CompactOfferHeader
          profiles={offer.profiles}
          created_at={offer.created_at}
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
        <CompactOfferPricing
          price={offer.price}
          zone={offer.contact_info?.zone}
        />

        {/* Condition, delivery, and description */}
        <CompactOfferDetails
          condition={offer.contact_info?.condition}
          delivery_time={offer.delivery_time}
          description={offer.description}
        />

        {/* Accept/Reject Actions - positioned at the bottom for buy request owner */}
        {canAcceptOrReject && (
          <div className="mt-auto pt-3">
            <CompactOfferActions
              offerId={offer.id}
              canAcceptOrReject={canAcceptOrReject}
              onStatusUpdate={onStatusUpdate}
            />
          </div>
        )}
      </CardContent>

      {/* Rejection reason for rejected offers */}
      {offer.status === 'rejected' && offer.rejection_reason && (
        <CompactOfferRejectionReason 
          status={offer.status} 
          rejectionReason={offer.rejection_reason} 
        />
      )}

      {/* Edit/Delete buttons - only for offer owner */}
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
