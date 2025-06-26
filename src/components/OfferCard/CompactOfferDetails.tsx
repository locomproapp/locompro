
import React from 'react';
import { MapPin } from 'lucide-react';
import { getConditionText } from './CompactOfferUtils';

interface CompactOfferDetailsProps {
  contactInfo: any;
  deliveryTime: string | null;
  description: string | null;
}

const CompactOfferDetails = ({ contactInfo, deliveryTime, description }: CompactOfferDetailsProps) => {
  return (
    <>
      {/* Location */}
      <div className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span className="text-xs">{contactInfo?.zone || 'No especificada'}</span>
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

      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      )}
    </>
  );
};

export default CompactOfferDetails;
