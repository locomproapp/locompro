
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-[500px] h-[300px] sm:h-[500px] mx-auto bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Sin imágenes</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 w-full">
        {/* Imagen principal - responsive */}
        <div className="w-full max-w-[500px] h-[300px] sm:h-[500px] mx-auto bg-muted rounded-lg overflow-hidden">
          <img
            src={images[0]}
            alt="Imagen principal"
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedImage(0)}
          />
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-[500px] mx-auto px-4 sm:px-0">
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index + 1}
                className="aspect-square bg-muted rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative"
                onClick={() => setSelectedImage(index + 1)}
              >
                <img
                  src={image}
                  alt={`Imagen ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="w-full max-w-[500px] mx-auto px-4 sm:px-0">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSelectedImage(0)}
            >
              Ver todas las imágenes ({images.length})
            </Button>
          </div>
        )}
      </div>

      {/* Modal de galería completa */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative bg-black">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center min-h-[60vh] max-h-[80vh]">
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
            
            {/* Contador de imágenes */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded">
              {(selectedImage || 0) + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
