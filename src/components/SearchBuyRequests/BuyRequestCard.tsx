
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number;
  max_price: number;
  reference_image: string | null;
  zone: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

interface BuyRequestCardProps {
  request: BuyRequest;
}

const BuyRequestCard: React.FC<BuyRequestCardProps> = ({ request }) => {
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

  // Get display name with proper fallback
  const getDisplayName = () => {
    if (request.profiles?.full_name && request.profiles.full_name.trim() !== '') {
      return request.profiles.full_name;
    }
    return 'Usuario';
  };

  return (
    <Card key={request.id} className="hover:shadow-md transition-shadow">
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

      <CardContent className="flex flex-col gap-3">
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
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Por: {getDisplayName()}
          </p>
          <Button asChild size="sm">
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
