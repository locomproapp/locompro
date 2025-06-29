import React from 'react';
import { Search, ExternalLink } from 'lucide-react';
import ImageGallery from './ImageGallery';
import { capitalizeFirstLetter, capitalizeSentences } from '@/utils/textFormatting';

interface Post {
  id: string;
  title: string;
  description: string | null;
  characteristics: any;
  reference_link: string | null;
  images: string[] | null;
}

interface ProductInfoProps {
  post: Post;
}

const ProductInfo = ({ post }: ProductInfoProps) => {
  const formatCharacteristics = (characteristics: any) => {
    if (!characteristics) return null;
    
    // If it's a string, display it directly
    if (typeof characteristics === 'string') {
      return characteristics;
    }
    
    // If it's an object, format it nicely
    if (typeof characteristics === 'object') {
      return Object.entries(characteristics)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    
    return JSON.stringify(characteristics, null, 2);
  };

  return (
    <div className="space-y-6">
      {/* Galería de imágenes */}
      <div className="bg-card rounded-lg border border-border p-6">
        <ImageGallery images={post.images || []} />
      </div>

      {/* Información del producto */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            BUSCO
          </span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          {capitalizeFirstLetter(post.title)}
        </h1>

        {post.description && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {capitalizeSentences(post.description)}
            </p>
          </div>
        )}

        {post.characteristics && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">Características</h3>
            <div className="text-muted-foreground bg-muted p-3 rounded">
              {formatCharacteristics(post.characteristics)}
            </div>
          </div>
        )}

        {post.reference_link && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">Enlace de referencia</h3>
            <a
              href={post.reference_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Ver ejemplo
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
