
import React from 'react';
import BuyRequestOffersList from '@/components/BuyRequestOffersList';

interface CompareOffersProps {
  buyRequestId: string;
  isOwner: boolean;
}

const CompareOffers = ({ buyRequestId }: CompareOffersProps) => {
  // Este componente ahora es solo un wrapper para el nuevo sistema de ofertas
  // La funcionalidad completa está en BuyRequestOffersList
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        Las ofertas ahora se muestran arriba en la sección principal.
      </p>
    </div>
  );
};

export default CompareOffers;
