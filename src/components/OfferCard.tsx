
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, MessageCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Chat from '@/components/Chat';
import OfferHeader from './OfferCard/OfferHeader';
import RejectionReason from './OfferCard/RejectionReason';
import ContactInfo from './OfferCard/ContactInfo';
import OfferActions from './OfferCard/OfferActions';
import SellerOfferActions from './OfferCard/SellerOfferActions';
import RejectedOfferActions from './OfferCard/RejectedOfferActions';
import { Badge } from '@/components/ui/badge';

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
  currentUserId?: string;
}

const OfferCard = ({ offer, showActions = false, showPublicInfo = false, onStatusUpdate, currentUserId }: OfferCardProps) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'destructive';
      case 'withdrawn': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'withdrawn': return 'Retirada';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'nuevo': return 'Nuevo';
      case 'usado-excelente': return 'Usado - Excelente estado';
      case 'usado-muy-bueno': return 'Usado - Muy buen estado';
      case 'usado-bueno': return 'Usado - Buen estado';
      case 'usado-regular': return 'Usado - Estado regular';
      case 'refurbished': return 'Reacondicionado';
      case 'para-repuestos': return 'Para repuestos';
      default: return condition;
    }
  };

  // Determine user role
  const isSeller = currentUserId === offer.seller_id;
  const isBuyer = showActions && !isSeller; // showActions is true for buyers in CompareOffers
  const shouldShowChat = offer.status === 'accepted' && currentUserId && offer.buy_requests;

  return (
    <div className="space-y-4">
      <Card className={`p-4 ${offer.status === 'rejected' ? 'ring-1 ring-red-200 bg-red-50' : offer.status === 'accepted' ? 'ring-1 ring-green-200 bg-green-50' : ''}`}>
        <div className="space-y-3">
          {/* Title and Price */}
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg flex-1 mr-4">{offer.title}</h3>
            <div className="text-xl font-bold text-primary">
              ${offer.price.toLocaleString('es-AR')}
            </div>
          </div>

          {/* Status Badge (centered) */}
          <div className="flex justify-center">
            <Badge variant={getStatusColor(offer.status)}>
              {getStatusText(offer.status)}
            </Badge>
          </div>

          {/* Structured Information */}
          <div className="space-y-1">
            {offer.contact_info?.zone && (
              <div>
                <span className="font-medium">Zona: </span>
                <span className="text-muted-foreground">{offer.contact_info.zone}</span>
              </div>
            )}

            {offer.contact_info?.condition && (
              <div>
                <span className="font-medium">Estado: </span>
                <span className="text-muted-foreground">{getConditionText(offer.contact_info.condition)}</span>
              </div>
            )}

            {offer.description && (
              <div>
                <span className="font-medium">Descripción: </span>
                <span className="text-muted-foreground">{offer.description}</span>
              </div>
            )}
          </div>

          {/* Date and Username */}
          <div className="space-y-1 border-t pt-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(offer.created_at)}</span>
            </div>
            <div className="text-sm font-medium text-foreground">
              {offer.profiles?.full_name || 'Usuario anónimo'}
            </div>
          </div>

          {/* Status explanation for sellers */}
          {isSeller && offer.status === 'pending' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Tu oferta está pendiente. El comprador debe aceptarla o rechazarla.
              </AlertDescription>
            </Alert>
          )}

          {offer.status === 'rejected' && offer.rejection_reason && (
            <RejectionReason rejectionReason={offer.rejection_reason} />
          )}

          {offer.contact_info && (showActions || showPublicInfo) && (
            <ContactInfo contactInfo={offer.contact_info} />
          )}

          {/* Actions for buyers (accept/reject) */}
          {isBuyer && (
            <OfferActions
              offerId={offer.id}
              status={offer.status}
              showActions={showActions}
              onStatusUpdate={onStatusUpdate}
            />
          )}

          {/* Actions for sellers (withdraw) - only for pending offers */}
          {isSeller && offer.status === 'pending' && (
            <SellerOfferActions
              offerId={offer.id}
              status={offer.status}
              onStatusUpdate={onStatusUpdate}
            />
          )}

          {/* Actions for sellers (counteroffer/delete) - only for rejected offers */}
          {isSeller && offer.status === 'rejected' && (
            <RejectedOfferActions
              offerId={offer.id}
              currentPrice={offer.price}
              onStatusUpdate={onStatusUpdate}
            />
          )}
        </div>
      </Card>

      {/* Show chat when offer is accepted - for both buyer and seller */}
      {shouldShowChat && (
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
      )}
    </div>
  );
};

export default OfferCard;
