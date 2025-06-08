
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Calendar } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  description: string | null;
  min_price: number | null;
  max_price: number | null;
  reference_link: string | null;
  zone: string;
  contact_info: any;
  characteristics: any;
  images: string[] | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Precio a consultar';
    if (min && max && min !== max) return `$${min} - $${max}`;
    if (min) return `$${min}`;
    if (max) return `$${max}`;
    return 'Precio a consultar';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2">{post.title}</h3>
          {post.description && (
            <p className="text-muted-foreground text-sm line-clamp-3 mt-2">
              {post.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="font-semibold">
            {formatPrice(post.min_price, post.max_price)}
          </Badge>
          {post.reference_link && (
            <a
              href={post.reference_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
              title="Ver enlace de referencia"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{post.zone}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          {post.profiles?.full_name && (
            <span>Por: {post.profiles.full_name}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
