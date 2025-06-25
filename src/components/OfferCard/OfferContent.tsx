
import React from 'react';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import RejectionReason from './RejectionReason';

interface OfferContentProps {
  offer: {
    contact_info: any;
    description: string | null;
    delivery_time: string | null;
    created_at: string;
    images: string[] | null;
    profiles?: {
      full_name: string | null;
      email: string | null;
    } | null;
    status: string;
    rejection_reason: string | null;
  };
}

const OfferContent = ({ offer }: OfferContentProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <>
      {/* Structured Information - reordered as requested */}
      <div className="space-y-1">
        {/* Description first */}
        {offer.description && (
          <div>
            <span className="font-medium">Descripción: </span>
            <span className="text-muted-foreground">{offer.description}</span>
          </div>
        )}

        {/* Estado second */}
        {offer.contact_info?.condition && (
          <div>
            <span className="font-medium">Estado: </span>
            <span className="text-muted-foreground">{getConditionText(offer.contact_info.condition)}</span>
          </div>
        )}

        {/* Zona third */}
        {offer.contact_info?.zone && (
          <div>
            <span className="font-medium">Zona: </span>
            <span className="text-muted-foreground">{offer.contact_info.zone}</span>
          </div>
        )}

        {/* Envío fourth */}
        {offer.delivery_time && (
          <div>
            <span className="font-medium">Envío: </span>
            <span className="text-muted-foreground">{getDeliveryText(offer.delivery_time)}</span>
          </div>
        )}
      </div>

      {/* Photos section */}
      {offer.images && offer.images.length > 0 ? (
        <div className="border-t pt-3">
          <div className="font-medium mb-2">Fotos:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {offer.images.slice(0, 6).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Foto ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
            ))}
            {offer.images.length > 6 && (
              <div className="w-full h-20 bg-muted rounded border flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  +{offer.images.length - 6} más
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border-t pt-3">
          <div className="font-medium mb-2">Fotos:</div>
          <div className="w-full h-20 bg-muted rounded border flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground ml-2">Sin fotos</span>
          </div>
        </div>
      )}

      {/* Date and Username */}
      <div className="space-y-1 border-t pt-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(offer.created_at)}</span>
        </div>
        <div className="text-sm font-medium text-foreground">
          {offer.profiles?.full_name || 'Usuario anónimo'}
        </div>
      </div>

      {offer.status === 'rejected' && offer.rejection_reason && (
        <RejectionReason rejectionReason={offer.rejection_reason} />
      )}
    </>
  );
};

export default OfferContent;
