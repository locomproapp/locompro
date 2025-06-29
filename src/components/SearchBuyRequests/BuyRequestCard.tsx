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

  // Function to determine spacing based on title length
  // 8px spacing (mb-2) for all cases now
  const getTitleSpacingClass = (title: string) => {
    return 'mb-2'; // Always 8px spacing
  };

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

  // Mobile vertical layout with consistent 8px (2 units) spacing
  return (
    <Link to={`/buy-request/${request.id}`} className="block h-full">
      <Card className="hover:shadow-md transition-shadow rounded-none border h-full flex flex-col cursor-pointer">
        <CardContent className="p-3 flex flex-col h-full">
          {/* Title with fixed height for 2 lines and 8px spacing below */}
          <h3 className={`text-sm font-semibold leading-tight line-clamp-3 flex items-start h-[2.4rem] ${getTitleSpacingClass(request.title)}`}>
            {request.title}
          </h3>
          
          {/* Price label with 8px spacing below */}
          <div className="mb-2 flex justify-center">
            <div className="w-full bg-primary/10 border border-primary/20 rounded-lg py-1 px-3 text-center">
              <span className="font-bold text-xs text-primary whitespace-nowrap">
                {formatPrice(request.min_price, request.max_price)}
              </span>
            </div>
          </div>
          
          {/* Photo in the middle with 8px spacing below */}
          <div className="mb-2 flex-shrink-0">
            {request.reference_image ? (
              <div className="aspect-square w-full overflow-hidden bg-gray-50 border border-gray-100">
                <img
                  src={request.reference_image}
                  alt="Referencia"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                Sin imagen
              </div>
            )}
          </div>
          
          {/* Date and zone at the bottom with 8px spacing above (pt-2) */}
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{formatDate(request.created_at)}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{request.zone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BuyRequestCard;
