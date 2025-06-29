
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDisplayNameWithCurrentUser } from '@/utils/displayName';
import { useAuth } from '@/hooks/useAuth';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number;
  max_price: number;
  reference_image: string | null;
  zone: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    location: string | null;
    email: string | null;
  } | null;
}

interface BuyRequestCardProps {
  request: BuyRequest;
  isDesktopHorizontal?: boolean;
}

const BuyRequestCard: React.FC<BuyRequestCardProps> = ({ request, isDesktopHorizontal = false }) => {
  const { user } = useAuth();

  const formatPrice = (min: number, max: number) => {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (min === max) return format(min);
    return `${format(min)} - ${format(max)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const displayName = getDisplayNameWithCurrentUser(
    request.profiles,
    request.user_id,
    user?.id
  );

  if (isDesktopHorizontal) {
    // Desktop horizontal layout
    return (
      <Card className="hover:shadow-md transition-shadow rounded-none border">
        <div className="flex">
          {/* Image section */}
          <div className="w-48 h-32 flex-shrink-0">
            {request.reference_image ? (
              <img
                src={request.reference_image}
                alt="Referencia"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>

          {/* Content section */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2 flex-1 mr-4">
                  {request.title}
                </CardTitle>
                <Badge variant="outline" className="font-bold flex-shrink-0">
                  {formatPrice(request.min_price, request.max_price)}
                </Badge>
              </div>
              
              {request.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {request.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {request.zone}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(request.created_at)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-3">
              <p className="text-xs text-muted-foreground flex-shrink-0 min-w-0 truncate">
                Por: {displayName}
              </p>
              <Button asChild size="sm" className="flex-shrink-0">
                <Link to={`/buy-request/${request.id}`} className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Ver detalles
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Mobile vertical layout
  return (
    <Card className="hover:shadow-md transition-shadow h-auto rounded-none border">
      <CardHeader className="space-y-2 p-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm line-clamp-2 leading-tight">
            {request.title}
          </CardTitle>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-bold text-xs px-1 py-0.5">
            {formatPrice(request.min_price, request.max_price)}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(request.created_at)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 p-3 pt-0">
        <div className="space-y-2 flex-1">
          {request.reference_image && (
            <img
              src={request.reference_image}
              alt="Referencia"
              className="w-full h-24 object-cover"
            />
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {request.zone}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-2 mt-auto">
          <p className="text-xs text-muted-foreground flex-shrink-0 min-w-0 truncate">
            Por: {displayName}
          </p>
          <Button asChild size="sm" className="flex-shrink-0 text-xs px-2 py-1 h-6">
            <Link to={`/buy-request/${request.id}`} className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Ver
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyRequestCard;
