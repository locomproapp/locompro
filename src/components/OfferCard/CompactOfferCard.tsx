
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getDisplayNameWithCurrentUser } from '@/utils/displayName';
import CompactOfferImageCarousel from './CompactOfferImageCarousel';
import CompactOfferActions from './CompactOfferActions';
import CompactOfferOwnerActions from './CompactOfferOwnerActions';
import CompactOfferRejectionReason from './CompactOfferRejectionReason';
import CompactOfferPrice from './CompactOfferPrice';
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

  const formatExactDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month}. ${year} ${hours}:${minutes} hs`;
  };

  const getStatusBadge = () => {
    switch (offer.status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aceptada</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>;
      case 'finalized':
        return <Badge variant="outline" className="bg-gray-100 text-gray-600">Finalizada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
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

  const getCardClassName = () => {
    switch (offer.status) {
      case 'rejected':
        return 'ring-1 ring-red-200 bg-red-50';
      case 'accepted':
        return 'ring-1 ring-green-200 bg-green-50';
      case 'finalized':
        return 'ring-1 ring-gray-200 bg-gray-50';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Card className={`w-96 h-[540px] flex-shrink-0 flex flex-col ${getCardClassName()}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={undefined} alt={displayName || 'Usuario'} />
                <AvatarFallback className="text-xs">
                  {displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-sm text-foreground">
                  {displayName || 'Usuario anónimo'}
                </h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatExactDate(offer.created_at)}
                </div>
              </div>
            </div>
            {getStatusBadge()}
          </div>
          
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
            {offer.title}
          </h3>
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
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{offer.contact_info?.zone || 'No especificada'}</span>
            </div>
          </div>

          {/* Condition and delivery */}
          <div className="space-y-1 text-xs">
            {offer.contact_info?.condition && (
              <div>
                <span className="font-medium">Estado: </span>
                <span className="text-muted-foreground">{getConditionText(offer.contact_info.condition)}</span>
              </div>
            )}
            {offer.delivery_time && (
              <div>
                <span className="font-medium">Envío: </span>
                <span className="text-muted-foreground">{offer.delivery_time}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {offer.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{offer.description}</p>
          )}

          {/* Spacer to push buttons to bottom */}
          <div className="flex-1" />

          {/* Accept/Reject Actions - only for buy request owner */}
          {canAcceptOrReject && (
            <div className="mt-auto">
              <CompactOfferActions
                offerId={offer.id}
                canAcceptOrReject={canAcceptOrReject}
                onStatusUpdate={onStatusUpdate}
              />
            </div>
          )}

          {/* Blank space for consistent height when no buttons */}
          {!canAcceptOrReject && !isOfferOwner && (
            <div className="h-10" />
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
