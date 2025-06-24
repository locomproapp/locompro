
import React from 'react';
import { Calendar } from 'lucide-react';
import RejectionReason from './RejectionReason';

interface OfferContentProps {
  offer: {
    contact_info: any;
    description: string | null;
    created_at: string;
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

  return (
    <>
      {/* Structured Information - directly below title */}
      <div className="space-y-1">
        {offer.contact_info?.zone && (
          <div>
            <span className="font-medium">Zona: </span>
            <span className="text-muted-foreground">{offer.contact_info.zone}</span>
          </div>
        )}

        {offer.contact_info?.condition && (
          <div>
            <span className="font-medium">Estado: </span>
            <span className="text-muted-foreground">{getConditionText(offer.contact_info.condition)}</span>
          </div>
        )}

        {offer.description && (
          <div>
            <span className="font-medium">Descripción: </span>
            <span className="text-muted-foreground">{offer.description}</span>
          </div>
        )}
      </div>

      {/* Date and Username */}
      <div className="space-y-1 border-t pt-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(offer.created_at)}</span>
        </div>
        <div className="text-sm font-medium text-foreground">
          {offer.profiles?.full_name || 'Sin nombre'}
        </div>
      </div>

      {offer.status === 'rejected' && offer.rejection_reason && (
        <RejectionReason rejectionReason={offer.rejection_reason} />
      )}
    </>
  );
};

export default OfferContent;
