
import React, { useState } from 'react';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from './utils';
import ImageLightbox from '@/components/ImageLightbox';

interface OfferContentProps {
  title: string;
  description: string | null;
  price: number;
  zone: string;
  images: string[] | null;
  characteristics: any;
}

const OfferContent = ({ title, description, price, zone, images, characteristics }: OfferContentProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
      <div className="space-y-2 md:space-y-3 flex-1">
        {/* Image section */}
        <div className="relative h-24 bg-muted rounded border">
          {images && images.length > 0 ? (
            <>
              <button 
                onClick={() => setLightboxOpen(true)} 
                className="w-full h-full rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Ver imagen en tamaño completo"
              >
                <img
                  src={images[selectedImageIndex]}
                  alt={`${title} ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>

              {images.length > 1 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {selectedImageIndex + 1}/{images.length}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Price and location */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            ${formatPrice(price)}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{zone || 'No especificada'}</span>
          </div>
        </div>

        {/* Condition and delivery info */}
        <div className="space-y-1 text-xs">
          {characteristics?.condition && (
            <div>
              <span className="font-medium">Estado: </span>
              <span className="text-muted-foreground">{getConditionText(characteristics.condition)}</span>
            </div>
          )}
          {characteristics?.delivery && (
            <div>
              <span className="font-medium">Envío: </span>
              <span className="text-muted-foreground">{characteristics.delivery}</span>
            </div>
          )}
        </div>

        {/* Description with fixed height for mobile consistency */}
        <div className="h-[3.5rem] md:h-[4.5rem]">
          <div className="h-full flex flex-col justify-start">
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {description || 'Sin descripción proporcionada'}
            </p>
          </div>
        </div>
      </div>

      {images && images.length > 0 && (
        <ImageLightbox
          images={images}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          startIndex={selectedImageIndex}
        />
      )}
    </>
  );
};

export default OfferContent;
