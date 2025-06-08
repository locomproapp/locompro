
import React from 'react';
import { User, Star, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Profile {
  full_name: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
}

interface Post {
  contact_info: any;
  profiles?: Profile | null;
  user_id: string;
}

interface BuyerInfoProps {
  post: Post;
}

const BuyerInfo = ({ post }: BuyerInfoProps) => {
  // Mock rating for now - in a real app this would come from the database
  const userRating = 4.2;
  const totalReviews = 15;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <User className="h-4 w-4" />
        Comprador
      </h3>
      
      <div className="space-y-4">
        {/* Avatar y nombre */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={post.profiles?.avatar_url || undefined} 
              alt={post.profiles?.full_name || 'Usuario'} 
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(post.profiles?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {post.profiles?.full_name || 'Usuario anónimo'}
            </p>
            {post.profiles?.location && (
              <p className="text-sm text-muted-foreground">
                {post.profiles.location}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Valoración:</span>
            <div className="flex items-center gap-2">
              {renderStars(userRating)}
              <span className="text-xs text-muted-foreground">
                ({totalReviews} reseñas)
              </span>
            </div>
          </div>
        </div>

        {/* Bio si existe */}
        {post.profiles?.bio && (
          <div>
            <p className="text-sm text-muted-foreground">
              {post.profiles.bio}
            </p>
          </div>
        )}

        {/* Botón ver perfil público */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          asChild
        >
          <a 
            href={`/profile/${post.user_id}`}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Ver perfil público
          </a>
        </Button>

        {/* Información de contacto existente */}
        {post.contact_info && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Información de contacto:</h4>
            <div className="bg-muted p-2 rounded text-xs">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(post.contact_info, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerInfo;
