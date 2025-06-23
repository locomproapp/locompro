
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import ImageLightbox from '@/components/ImageLightbox';

interface PostImageProps {
  images: string[] | null;
}

const PostImage = ({ images }: PostImageProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full flex items-start justify-center md:justify-end">
        <div className="w-full aspect-square max-w-md bg-muted rounded-lg flex items-center justify-center text-muted-foreground border border-border">
          Sin imagen
        </div>
      </div>
    );
  }

  const mainImage = images[selectedIndex];
  const maxThumbnails = 6;
  const visibleThumbnails = images.slice(0, maxThumbnails);
  const remainingCount = images.length - maxThumbnails;

  const handleMorePhotosClick = () => {
    setSelectedIndex(6); // Start at the 7th photo (index 6)
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-start w-full justify-center">
        
        {/* Main Image */}
        <div className="flex-1 max-w-md">
          <button 
            onClick={() => setLightboxOpen(true)} 
            className="w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Ver imagen en tamaño completo"
          >
            <img
              src={mainImage}
              alt="Imagen principal"
              className="rounded-lg w-full h-auto object-cover border border-border shadow-lg"
              style={{ aspectRatio: '1 / 1' }}
            />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-2 md:pb-0">
            {visibleThumbnails.map((image, index) => (
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
            
            {/* +X More Photos Button */}
            {remainingCount > 0 && (
              <button
                onClick={handleMorePhotosClick}
                className="w-20 h-20 flex-shrink-0 rounded-lg border-2 border-transparent hover:border-muted-foreground/50 bg-muted flex items-center justify-center transition-all"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  +{remainingCount}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
      <ImageLightbox
        images={images}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        startIndex={selectedIndex}
      />
    </>
  );
};

export default PostImage;
