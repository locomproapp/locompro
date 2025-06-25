
import React, { useState } from 'react';
import { Calendar, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RejectionReason from './RejectionReason';
import ImageLightbox from '@/components/ImageLightbox';

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  const goToPrevious = () => {
    if (offer.images && offer.images.length > 0) {
      setSelectedImageIndex((prevIndex) => 
        prevIndex === 0 ? offer.images!.length - 1 : prevIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (offer.images && offer.images.length > 0) {
      setSelectedImageIndex((prevIndex) => 
        prevIndex === offer.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <>
      {/* Side-by-side layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left side - Text Information */}
        <div className="flex-1 space-y-3">
          {/* Structured Information */}
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
        </div>

        {/* Right side - Photos section with carousel */}
        <div className="lg:w-1/2">
          {offer.images && offer.images.length > 0 ? (
            <div>
              <div className="font-medium mb-2">Fotos:</div>
              <div className="relative">
                {/* Main Image */}
                <button 
                  onClick={() => setLightboxOpen(true)} 
                  className="w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Ver imagen en tamaño completo"
                >
                  <img
                    src={offer.images[selectedImageIndex]}
                    alt={`Foto ${selectedImageIndex + 1}`}
                    className="w-full h-48 object-cover rounded border"
                  />
                </button>

                {/* Navigation Controls - only show if more than 1 image */}
                {offer.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Image Counter */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                      {selectedImageIndex + 1} / {offer.images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="font-medium mb-2">Fotos:</div>
              <div className="w-full h-48 bg-muted rounded border flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Sin fotos</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {offer.status === 'rejected' && offer.rejection_reason && (
        <RejectionReason rejectionReason={offer.rejection_reason} />
      )}

      {/* Image Lightbox */}
      {offer.images && offer.images.length > 0 && (
        <ImageLightbox
          images={offer.images}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          startIndex={selectedImageIndex}
        />
      )}
    </>
  );
};

export default OfferContent;
