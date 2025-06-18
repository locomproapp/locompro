
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Post {
  title: string;
  min_price: number | null;
  max_price: number | null;
  zone: string;
  characteristics: any;
  created_at: string;
  profiles: { full_name: string | null } | null;
  reference_link: string | null;
}

interface PostInformationProps {
  post: Post;
}

const PostInformation = ({ post }: PostInformationProps) => {
  const formatPrice = (min: number | null, max: number | null) => {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (!min && !max) return 'Precio a consultar';
    if (min && max && min !== max) return `${format(min)} - ${format(max)}`;
    if (min) return format(min);
    if (max) return format(max);
    return 'Precio a consultar';
  };

  let formattedCharacteristics = null;
  if (post.characteristics) {
    if (typeof post.characteristics === 'string') {
      formattedCharacteristics = post.characteristics;
    } else if (typeof post.characteristics === 'object') {
      formattedCharacteristics = Object.entries(post.characteristics)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        {post.title}
      </h1>
      
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Precio</h3>
          <p className="text-lg text-primary font-bold">{formatPrice(post.min_price, post.max_price)}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Zona</h3>
          <p className="text-base text-foreground">{post.zone}</p>
        </div>

        {formattedCharacteristics && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Características</h3>
            <p className="text-base text-foreground whitespace-pre-wrap">{formattedCharacteristics}</p>
          </div>
        )}

        {post.reference_link && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Enlace de referencia</h3>
            <a
              href={post.reference_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-base"
            >
              Ver ejemplo
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostInformation;
