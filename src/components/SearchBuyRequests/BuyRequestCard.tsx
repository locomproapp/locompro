
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
      <Card className="hover:shadow-md transition-shadow rounded-none border-b border-l-0 border-r-0 border-t-0">
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
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg line-clamp-2 flex-1 min-w-0">
                  {request.title}
                </CardTitle>
                <Badge variant="outline" className="font-bold flex-shrink-0 whitespace-nowrap">
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
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{request.zone}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Calendar className="h-3 w-3" />
                  {formatDate(request.created_at)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-3">
              <p className="text-xs text-muted-foreground flex-shrink-0 min-w-0 truncate">
                Por: {displayName}
              </p>
              <Button asChild size="sm" className="flex-shrink-0 whitespace-nowrap">
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

  // Mobile vertical layout - optimized for two-column grid
  return (
    <Card className="hover:shadow-md transition-shadow rounded-none border flex flex-col h-full">
      <CardHeader className="p-2 pb-1 flex-shrink-0">
        <div className="space-y-1.5">
          <CardTitle className="text-xs leading-tight line-clamp-3 min-h-[2.7rem] flex items-start">
            {request.title}
          </CardTitle>
          <div className="flex items-center justify-between gap-1">
            <Badge variant="outline" className="font-bold text-[10px] px-1 py-0.5 flex-shrink-0">
              {formatPrice(request.min_price, request.max_price)}
            </Badge>
            <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground flex-shrink-0">
              <Calendar className="h-2.5 w-2.5" />
              <span>{formatDate(request.created_at)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 pt-0 flex flex-col flex-1 min-h-0">
        <div className="flex-1 space-y-1.5">
          {request.reference_image && (
            <div className="aspect-square w-full overflow-hidden bg-gray-100">
              <img
                src={request.reference_image}
                alt="Referencia"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate">{request.zone}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-1 pt-1.5 mt-auto border-t border-gray-100">
          <p className="text-[10px] text-muted-foreground flex-shrink-0 min-w-0 truncate max-w-[60%]">
            Por: {displayName}
          </p>
          <Button asChild size="sm" className="flex-shrink-0 text-[10px] px-1.5 py-0.5 h-5 min-w-0">
            <Link to={`/buy-request/${request.id}`} className="flex items-center gap-0.5">
              <Eye className="h-2.5 w-2.5" />
              <span>Ver</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyRequestCard;
