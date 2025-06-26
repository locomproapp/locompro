
import React from 'react';

interface CompactOfferDetailsProps {
  condition?: string;
  delivery_time: string | null;
  description: string | null;
}

const CompactOfferDetails = ({ condition, delivery_time, description }: CompactOfferDetailsProps) => {
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
      {/* Condition and delivery */}
      <div className="space-y-1 text-xs">
        {condition && (
          <div>
            <span className="font-medium">Estado: </span>
            <span className="text-muted-foreground">{getConditionText(condition)}</span>
          </div>
        )}
        {delivery_time && (
          <div>
            <span className="font-medium">Envío: </span>
            <span className="text-muted-foreground">{delivery_time}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      )}
    </>
  );
};

export default CompactOfferDetails;
