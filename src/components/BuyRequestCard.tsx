
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Calendar, Search } from 'lucide-react';
import OfferForm from './OfferForm';
import BuyRequestActions from './BuyRequestActions';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number | null;
  max_price: number | null;
  reference_image: string | null;
  zone: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

interface BuyRequestCardProps {
  buyRequest: BuyRequest;
  showOfferButton?: boolean;
  showActions?: boolean;
  onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
  onUpdate?: () => void;
  hideBuscoTag?: boolean;
}

const BuyRequestCard = ({ 
  buyRequest, 
  showOfferButton = false, 
  showActions = false,
  onDelete,
  onUpdate,
  hideBuscoTag = false,
}: BuyRequestCardProps) => {
  const formatPrice = (min: number | null, max: number | null) => {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (!min && !max) return 'Presupuesto abierto';
    if (min && max && min !== max) return `${format(min)} - ${format(max)}`;
    if (min) return `Desde ${format(min)}`;
    if (max) return `Hasta ${format(max)}`;
    return 'Presupuesto abierto';
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagen principal */}
      {buyRequest.reference_image && (
        <Link to={`/buy-request/${buyRequest.id}`}>
          <div className="aspect-video bg-muted overflow-hidden">
            <img
              src={buyRequest.reference_image}
              alt={buyRequest.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        </Link>
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {!hideBuscoTag && (
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  BUSCO
                </span>
              </div>
            )}
            <Link to={`/buy-request/${buyRequest.id}`}>
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                {buyRequest.title}
              </h3>
            </Link>
            {buyRequest.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
                {buyRequest.description}
              </p>
            )}
          </div>
          {showActions && onDelete && onUpdate && (
            <BuyRequestActions
              buyRequestId={buyRequest.id}
              buyRequestTitle={buyRequest.title}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="font-semibold">
            {formatPrice(buyRequest.min_price, buyRequest.max_price)}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{buyRequest.zone}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(buyRequest.created_at)}</span>
          </div>
          <span>Por: {buyRequest.profiles?.full_name || 'Sin nombre'}</span>
        </div>

        {showOfferButton && (
          <div className="pt-2">
            <OfferForm 
              buyRequestId={buyRequest.id}
              buyRequestTitle={buyRequest.title}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default BuyRequestCard;
