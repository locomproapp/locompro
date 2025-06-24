
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
      
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        {offer.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-foreground mb-2">Precio</h3>
          <p className="text-2xl font-bold text-primary">
            ${offer.price.toLocaleString('es-AR')}
          </p>
        </div>

        {offer.contact_info?.zone && (
          <div>
            <h3 className="font-semibold text-foreground mb-2">Zona</h3>
            <p className="text-muted-foreground">{offer.contact_info.zone}</p>
          </div>
        )}

        {offer.delivery_time && (
          <div>
            <h3 className="font-semibold text-foreground mb-2">Tiempo de entrega</h3>
            <p className="text-muted-foreground">{offer.delivery_time}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-foreground mb-2">Fecha de creación</h3>
          <p className="text-muted-foreground">
            {new Date(offer.created_at).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

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
