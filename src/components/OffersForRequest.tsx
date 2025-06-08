
import React from 'react';
import { useOffers } from '@/hooks/useOffers';
import OfferCard from './OfferCard';
import { Package } from 'lucide-react';

interface OffersForRequestProps {
  buyRequestId: string;
  onOfferUpdate?: () => void;
}

const OffersForRequest = ({ buyRequestId, onOfferUpdate }: OffersForRequestProps) => {
  const { offers, loading, refetch } = useOffers(buyRequestId);

  const handleOfferUpdate = () => {
    refetch();
    onOfferUpdate?.();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Package className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-sm">Cargando ofertas...</p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <p className="text-muted-foreground text-sm">Aún no has recibido ofertas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        {offers.length} {offers.length === 1 ? 'oferta recibida' : 'ofertas recibidas'}
      </h3>
      <div className="space-y-3">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            showActions={true}
            onStatusUpdate={handleOfferUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersForRequest;
