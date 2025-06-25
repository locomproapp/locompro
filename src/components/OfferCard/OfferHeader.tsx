
import React from 'react';
import { Badge } from '@/components/ui/badge';
import PriceHistory from './PriceHistory';

interface OfferHeaderProps {
  offer: {
    title: string;
    price: number;
    status: string;
    price_history?: Array<{
      price: number;
      timestamp: string;
      type: 'rejected' | 'initial';
    }> | null;
  };
}

const OfferHeader = ({ offer }: OfferHeaderProps) => {
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

  return (
    <div className="flex justify-between items-start">
      <h3 className="font-semibold text-lg flex-1 mr-4">{offer.title}</h3>
      <div className="flex flex-col items-end">
        <PriceHistory 
          currentPrice={offer.price}
          priceHistory={offer.price_history}
        />
        <Badge variant={getStatusColor(offer.status)} className="mt-1">
          {getStatusText(offer.status)}
        </Badge>
      </div>
    </div>
  );
};

export default OfferHeader;
