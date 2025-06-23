
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
  const hasMoreThan6 = images.length > 6;
  const remainingCount = images.length - 6;

  const handleMorePhotosClick = () => {
    setSelectedIndex(4); // Start at the 5th photo (index 4)
    setLightboxOpen(true);
  };

  const renderThumbnails = () => {
    if (!hasMoreThan6) {
      // Show all thumbnails if 6 or fewer images
      return images.map((image, index) => (
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
      ));
    }

    // More than 6 images: show first 4, +X button, then 6th image
    const thumbnails = [];
    
    // First 4 images
    for (let i = 0; i < 4; i++) {
      thumbnails.push(
        <button
          key={i}
          onClick={() => setSelectedIndex(i)}
          className={cn(
            "w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
            selectedIndex === i ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
          )}
        >
          <img
            src={images[i]}
            alt={`Thumbnail ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </button>
      );
    }

    // +X More Photos Button in 5th position
    thumbnails.push(
      <button
        key="more-photos"
        onClick={handleMorePhotosClick}
        className="w-20 h-20 flex-shrink-0 rounded-lg border-2 border-transparent hover:border-muted-foreground/50 bg-muted flex items-center justify-center transition-all"
      >
        <span className="text-sm font-medium text-muted-foreground">
          +{remainingCount}
        </span>
      </button>
    );

    // 6th image (index 5)
    thumbnails.push(
      <button
        key={5}
        onClick={() => setSelectedIndex(5)}
        className={cn(
          "w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
          selectedIndex === 5 ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
        )}
      >
        <img
          src={images[5]}
          alt={`Thumbnail 6`}
          className="w-full h-full object-cover"
        />
      </button>
    );

    return thumbnails;
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
            {renderThumbnails()}
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
