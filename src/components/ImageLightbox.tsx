
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
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

  const handleImageClick = (e: React.MouseEvent) => {
    // Prevenir que el click en la imagen cierre el modal
    e.stopPropagation();
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/70" />
        <DialogPrimitive.Content
          className="fixed left-0 top-0 z-50 w-full h-full focus:outline-none focus-visible:outline-none focus-visible:ring-0 outline-none ring-0"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          style={{ outline: 'none', boxShadow: 'none' }}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center cursor-default focus:outline-none focus-visible:outline-none outline-none"
            onClick={handleOverlayClick}
            tabIndex={-1}
            style={{ outline: 'none' }}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(false);
              }}
              className="absolute top-4 right-4 z-50 text-white bg-black/30 hover:bg-black/50 hover:text-white rounded-full outline-none border-none shadow-none focus:outline-none focus:ring-0 focus:bg-black/50 active:bg-black/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="Cerrar"
              tabIndex={-1}
              style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
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
                className="absolute left-4 z-50 text-white bg-black/30 hover:bg-black/50 hover:text-white rounded-full outline-none border-none shadow-none focus:outline-none focus:ring-0 focus:bg-black/50 active:bg-black/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="Anterior"
                tabIndex={-1}
                style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            )}

            {/* Image with uniform dimensions */}
            <img
              src={images[currentIndex]}
              alt={`Imagen ${currentIndex + 1}`}
              className="select-none cursor-default focus:outline-none focus-visible:outline-none outline-none"
              onClick={handleImageClick}
              tabIndex={-1}
              style={{ 
                width: '500px', 
                height: '500px', 
                objectFit: 'contain',
                backgroundColor: 'transparent',
                outline: 'none'
              }}
            />

            {/* Next Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 z-50 text-white bg-black/30 hover:bg-black/50 hover:text-white rounded-full outline-none border-none shadow-none focus:outline-none focus:ring-0 focus:bg-black/50 active:bg-black/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="Siguiente"
                tabIndex={-1}
                style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            )}
            
            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/30 text-white text-sm px-3 py-1.5 rounded-full select-none pointer-events-none focus:outline-none outline-none">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default ImageLightbox;
