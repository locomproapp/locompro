
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  startIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageLightbox = ({ images, startIndex = 0, open, onOpenChange }: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    if (open) {
      setCurrentIndex(startIndex);
    }
  }, [open, startIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      // Prevenir comportamiento por defecto y propagación para las flechas
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (e.key === 'ArrowLeft') {
          goToPrevious();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        }
        return;
      }
      
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false);
      }
    };

    if (open) {
      // Usar capture: true para interceptar antes que otros elementos
      document.addEventListener('keydown', handleKeyDown, { capture: true });
      
      // Bloquear el scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.body.style.overflow = 'unset';
    };
  }, [open, goToPrevious, goToNext, onOpenChange]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Cerrar cuando se hace click en cualquier parte del overlay
    onOpenChange(false);
  };

  const handleImageContainerClick = (e: React.MouseEvent) => {
    // Prevenir que el click en la imagen o sus controles cierre el modal
    e.stopPropagation();
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-transparent border-none shadow-none p-0 w-full h-full max-w-[95vw] max-h-[95vh]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center bg-neutral-900/50 cursor-pointer"
          onClick={handleOverlayClick}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
            className="absolute top-2 right-2 z-50 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-full"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 sm:left-4 z-50 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-full"
              aria-label="Anterior"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}

          {/* Image Container */}
          <div 
            className="w-full h-full flex items-center justify-center p-4 sm:p-8"
            onClick={handleImageContainerClick}
          >
             <img
              src={images[currentIndex]}
              alt={`Imagen ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 sm:right-4 z-50 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-full"
              aria-label="Siguiente"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          )}
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1.5 rounded-full select-none pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
