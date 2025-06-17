
import React from 'react';
import { Badge } from '@/components/ui/badge';
import ImageGallery from '@/components/ImageGallery';
import ContactInfo from '@/components/OfferCard/ContactInfo';
import RejectionReason from '@/components/OfferCard/RejectionReason';

interface OfferInformationProps {
  offer: any;
  isSeller: boolean;
  isBuyer: boolean;
}

const OfferInformation = ({ offer, isSeller, isBuyer }: OfferInformationProps) => {
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
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={getStatusColor(offer.status)}>
          {getStatusText(offer.status)}
        </Badge>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
        {offer.title}
      </h1>

      {offer.description && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {offer.description}
          </p>
        </div>
      )}

      {offer.images && offer.images.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-4">Imágenes</h3>
          <ImageGallery images={offer.images} />
        </div>
      )}

      {offer.status === 'rejected' && offer.rejection_reason && (
        <div className="mb-6">
          <RejectionReason rejectionReason={offer.rejection_reason} />
        </div>
      )}

      {offer.contact_info && (offer.status === 'accepted' || isSeller || isBuyer) && (
        <div className="mb-6">
          <ContactInfo contactInfo={offer.contact_info} />
        </div>
      )}
    </div>
  );
};

export default OfferInformation;
