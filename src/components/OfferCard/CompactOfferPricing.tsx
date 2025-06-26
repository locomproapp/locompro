
import React from 'react';
import { MapPin } from 'lucide-react';

interface CompactOfferPricingProps {
  price: number;
  zone?: string;
}

const CompactOfferPricing = ({ price, zone }: CompactOfferPricingProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    }).replace(/,/g, '.');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-lg font-bold text-primary">
        ${formatPrice(price)}
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span className="text-xs">{zone || 'No especificada'}</span>
      </div>
    </div>
  );
};

export default CompactOfferPricing;
