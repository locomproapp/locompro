
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const mainImage = images[selectedIndex];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-2 md:pb-0 md:pr-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                selectedIndex === index ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 w-full">
        <img
          src={mainImage}
          alt="Imagen principal"
          className="rounded-lg w-full h-auto object-cover border border-border"
          style={{ aspectRatio: '1 / 1' }}
        />
      </div>
    </div>
  );
};

export default ImageGallery;
