
import React from 'react';

interface PostImageProps {
  images: string[] | null;
}

const PostImage = ({ images }: PostImageProps) => {
  const mainImage = images && images.length ? images[0] : null;

  return (
    <div className="w-full flex items-start justify-center md:justify-end">
      {mainImage ? (
        <img
          src={mainImage}
          alt="Imagen principal"
          className="rounded-lg w-full max-w-md h-auto object-cover border border-border shadow-lg"
        />
      ) : (
        <div className="w-full aspect-square max-w-md bg-muted rounded-lg flex items-center justify-center text-muted-foreground border border-border">
          Sin imagen
        </div>
      )}
    </div>
  );
};

export default PostImage;
