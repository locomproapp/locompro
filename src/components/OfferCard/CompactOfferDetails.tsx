
import React from 'react';
import { MapPin } from 'lucide-react';
import CompactOfferImageCarousel from './CompactOfferImageCarousel';
import CompactOfferPrice from './CompactOfferPrice';
import CompactOfferOwnerActions from './CompactOfferOwnerActions';

interface CompactOfferDetailsProps {
  images: string[] | null;
  title: string;
  price: number;
  priceHistory?: Array<{
    price: number;
    timestamp: string;
    type: 'rejected' | 'initial';
  }> | null;
  status: string;
  contactInfo: any;
  deliveryTime: string | null;
  description: string | null;
  // New props for rejected offer handling
  offerId?: string;
  buyRequestId?: string;
  isOfferOwner?: boolean;
  onStatusUpdate?: () => void;
}

const CompactOfferDetails = ({ 
  images, 
  title, 
  price, 
  priceHistory, 
  status, 
  contactInfo, 
  deliveryTime, 
  description,
  offerId,
  buyRequestId,
  isOfferOwner,
  onStatusUpdate
}: CompactOfferDetailsProps) => {
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

  // Check if we should show action buttons instead of description
  const shouldShowActionsInDescription = status === 'rejected' && isOfferOwner && offerId && buyRequestId;

  return (
    <div className="space-y-3 flex-1">
      {/* Image section */}
      <CompactOfferImageCarousel 
        images={images} 
        title={title} 
      />

      {/* Price and location */}
      <div className="flex items-center justify-between">
        <CompactOfferPrice 
          currentPrice={price}
          priceHistory={priceHistory}
          status={status}
        />
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="text-xs">{contactInfo?.zone || 'No especificada'}</span>
        </div>
      </div>

      {/* Condition and delivery */}
      <div className="space-y-1 text-xs">
        {contactInfo?.condition && (
          <div>
            <span className="font-medium">Estado: </span>
            <span className="text-muted-foreground">{getConditionText(contactInfo.condition)}</span>
          </div>
        )}
        {deliveryTime && (
          <div>
            <span className="font-medium">Envío: </span>
            <span className="text-muted-foreground">{deliveryTime}</span>
          </div>
        )}
      </div>

      {/* Description with fixed height for 3 lines - responsive */}
      <div className="h-[4.5rem]">
        {shouldShowActionsInDescription ? (
          // Perfect centering container for action buttons in rejected offers owned by current user
          <div className="h-full flex items-center justify-center p-0 m-0">
            <CompactOfferOwnerActions
              offerId={offerId}
              buyRequestId={buyRequestId}
              status={status}
              isOfferOwner={true}
              onStatusUpdate={onStatusUpdate}
            />
          </div>
        ) : (
          // Show description for all other cases with proper flex layout
          <div className="h-full flex flex-col justify-start">
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {description || 'Sin descripción proporcionada'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactOfferDetails;
