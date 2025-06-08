
import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SendOfferDialog from './SendOfferDialog';

interface Post {
  id: string;
  title: string;
  min_price: number | null;
  max_price: number | null;
  zone: string;
  created_at: string;
}

interface PriceAndLocationProps {
  post: Post;
  isOwner: boolean;
}

const PriceAndLocation = ({ post, isOwner }: PriceAndLocationProps) => {
  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Presupuesto abierto';
    if (min && max && min !== max) return `$${min} - $${max}`;
    if (min) return `Desde $${min}`;
    if (max) return `Hasta $${max}`;
    return 'Presupuesto abierto';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="mb-4">
        <Badge variant="secondary" className="text-lg font-bold p-2">
          {formatPrice(post.min_price, post.max_price)}
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <MapPin className="h-4 w-4" />
        <span>{post.zone}</span>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground mb-6">
        <Calendar className="h-4 w-4" />
        <span>Publicado el {formatDate(post.created_at)}</span>
      </div>

      {!isOwner && (
        <SendOfferDialog 
          buyRequestId={post.id}
          buyRequestTitle={post.title}
        />
      )}
    </div>
  );
};

export default PriceAndLocation;
