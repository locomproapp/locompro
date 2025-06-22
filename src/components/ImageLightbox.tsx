
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
        className="bg-black/60 border-none shadow-none p-0 w-full h-full max-w-[100vw] max-h-[100vh] focus:outline-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center cursor-pointer focus:outline-none"
          onClick={handleOverlayClick}
          tabIndex={-1}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
            className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-full focus:outline-none focus:ring-0"
            aria-label="Cerrar"
            tabIndex={-1}
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
              className="absolute left-4 z-50 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-full focus:outline-none focus:ring-0"
              aria-label="Anterior"
              tabIndex={-1}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}

          {/* Image Container with fixed dimensions */}
          <div 
            className="flex items-center justify-center p-8 cursor-default focus:outline-none"
            onClick={handleImageContainerClick}
            tabIndex={-1}
            style={{ width: '80vw', height: '80vh', maxWidth: '800px', maxHeight: '600px' }}
          >
             <img
              src={images[currentIndex]}
              alt={`Imagen ${currentIndex + 1}`}
              className="w-full h-full object-contain select-none cursor-default focus:outline-none"
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
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
              className="absolute right-4 z-50 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-full focus:outline-none focus:ring-0"
              aria-label="Siguiente"
              tabIndex={-1}
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          )}
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1.5 rounded-full select-none pointer-events-none focus:outline-none">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
