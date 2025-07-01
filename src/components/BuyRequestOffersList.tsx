
import React from 'react';
import { useBuyRequestOffers } from '@/hooks/useBuyRequestOffers';
import BuyRequestOfferCard from '@/components/BuyRequestOfferCard';
import { Package } from 'lucide-react';

interface BuyRequestOffersListProps {
  buyRequestId: string;
  buyRequestOwnerId: string;
}

const BuyRequestOffersList = ({ buyRequestId, buyRequestOwnerId }: BuyRequestOffersListProps) => {
  const { offers, loading, refetch } = useBuyRequestOffers(buyRequestId);

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
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h4 className="font-semibold text-foreground mb-2">
          Aún no hay ofertas
        </h4>
        <p className="text-muted-foreground">
          Sé el primero en enviar una oferta para este producto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-xl">
          Ofertas Recibidas ({offers.length})
        </h3>
        <p className="text-sm text-muted-foreground">
          Ordenadas por fecha (más recientes primero)
        </p>
      </div>
      
      {/* Increased spacing between offer cards to accommodate external action buttons */}
      <div className="space-y-6">
        {offers.map((offer) => (
          <BuyRequestOfferCard
            key={offer.id}
            offer={offer}
            buyRequestOwnerId={buyRequestOwnerId}
            onUpdate={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default BuyRequestOffersList;
