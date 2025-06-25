
import React from 'react';
import { Badge } from '@/components/ui/badge';
import ImageGallery from '@/components/ImageGallery';
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

  const getDeliveryText = (delivery: string) => {
    switch (delivery) {
      case 'En persona': return 'En persona';
      case 'Por correo': return 'Por correo';
      default: return delivery;
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

      <div className="mb-4">
        <div className="text-2xl font-bold text-primary mb-4">
          ${offer.price.toLocaleString('es-AR')}
        </div>

        <div className="space-y-2">
          {offer.contact_info?.zone && (
            <div>
              <span className="font-medium text-foreground">Zona: </span>
              <span className="text-muted-foreground">{offer.contact_info.zone}</span>
            </div>
          )}

          {offer.contact_info?.condition && (
            <div>
              <span className="font-medium text-foreground">Estado: </span>
              <span className="text-muted-foreground">{getConditionText(offer.contact_info.condition)}</span>
            </div>
          )}

          {offer.delivery_time && (
            <div>
              <span className="font-medium text-foreground">Envío: </span>
              <span className="text-muted-foreground">{getDeliveryText(offer.delivery_time)}</span>
            </div>
          )}

          {offer.description && (
            <div>
              <span className="font-medium text-foreground">Descripción: </span>
              <span className="text-muted-foreground">{offer.description}</span>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">
            {new Date(offer.created_at).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-sm font-medium text-foreground">
            {offer.profiles?.full_name || 'Usuario anónimo'}
          </p>
        </div>
      </div>

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
    </div>
  );
};

export default OfferInformation;
