
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
}

const BuyRequestCard: React.FC<BuyRequestCardProps> = ({ request }) => {
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

  return (
    <Card key={request.id} className="hover:shadow-md transition-shadow h-auto sm:min-h-[320px] sm:px-6">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">
            {request.title}
          </CardTitle>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-bold">
            {formatPrice(request.min_price, request.max_price)}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(request.created_at)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 sm:justify-between">
        <div className="space-y-3 flex-1">
          {request.reference_image && (
            <img
              src={request.reference_image}
              alt="Referencia"
              className="w-full h-32 object-cover rounded"
            />
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {request.zone}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-4 mt-auto">
          <p className="text-xs text-muted-foreground flex-shrink-0">
            Por: {displayName}
          </p>
          <Button asChild size="sm" className="self-start sm:self-auto">
            <Link to={`/buy-request/${request.id}`} className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Ver detalles
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyRequestCard;
