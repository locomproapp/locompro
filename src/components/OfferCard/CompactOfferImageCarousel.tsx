
import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ImageLightbox from '@/components/ImageLightbox';

interface CompactOfferImageCarouselProps {
  images: string[] | null;
  title: string;
}

const CompactOfferImageCarousel = ({ images, title }: CompactOfferImageCarouselProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
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

export default CompactOfferImageCarousel;
