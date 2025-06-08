
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, MessageCircle } from 'lucide-react';
import Chat from '@/components/Chat';
import OfferHeader from './OfferCard/OfferHeader';
import RejectionReason from './OfferCard/RejectionReason';
import ContactInfo from './OfferCard/ContactInfo';
import OfferActions from './OfferCard/OfferActions';

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
  } | null;
}

interface OfferCardProps {
  offer: Offer;
  showActions?: boolean;
  showPublicInfo?: boolean;
  onStatusUpdate?: () => void;
}

const OfferCard = ({ offer, showActions = false, showPublicInfo = false, onStatusUpdate }: OfferCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <Card className={`p-4 ${offer.status === 'rejected' ? 'ring-1 ring-red-200 bg-red-50' : offer.status === 'accepted' ? 'ring-1 ring-green-200 bg-green-50' : ''}`}>
        <div className="space-y-3">
          <OfferHeader
            title={offer.title}
            price={offer.price}
            status={offer.status}
            buyRequest={offer.buy_requests}
            profile={offer.profiles}
            showPublicInfo={showPublicInfo}
            buyerRating={offer.buyer_rating}
          />

          {offer.description && (
            <p className="text-muted-foreground text-sm">{offer.description}</p>
          )}

          {offer.status === 'rejected' && offer.rejection_reason && (
            <RejectionReason rejectionReason={offer.rejection_reason} />
          )}

          {offer.contact_info && (showActions || showPublicInfo) && (
            <ContactInfo contactInfo={offer.contact_info} />
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(offer.created_at)}</span>
            </div>
          </div>

          <OfferActions
            offerId={offer.id}
            status={offer.status}
            showActions={showActions}
            onStatusUpdate={onStatusUpdate}
          />
        </div>
      </Card>

      {/* Show chat when offer is accepted */}
      {offer.status === 'accepted' && offer.buy_requests && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-800">¡Oferta aceptada! Chatea con el comprador</h4>
          </div>
          <Chat 
            buyRequestId={offer.buy_request_id}
            sellerId={offer.seller_id}
            offerId={offer.id}
          />
        </div>
      )}
    </div>
  );
};

export default OfferCard;
