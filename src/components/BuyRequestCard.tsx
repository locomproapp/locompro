
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BuyRequest {
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

interface BuyRequestCardProps {
  buyRequest: BuyRequest;
  showOfferButton?: boolean;
}

const BuyRequestCard = ({ buyRequest, showOfferButton = false }: BuyRequestCardProps) => {
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
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSendOffer = () => {
    // TODO: Implement offer sending functionality
    console.log('Sending offer for buy request:', buyRequest.id);
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                BUSCO
              </span>
            </div>
            <h3 className="font-semibold text-lg line-clamp-2">{buyRequest.title}</h3>
            {buyRequest.description && (
              <p className="text-muted-foreground text-sm line-clamp-3 mt-2">
                {buyRequest.description}
              </p>
            )}
          </div>
          {buyRequest.reference_link && (
            <a
              href={buyRequest.reference_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 ml-2"
              title="Ver enlace de referencia"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
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
          {buyRequest.profiles?.full_name && (
            <span>Por: {buyRequest.profiles.full_name}</span>
          )}
        </div>

        {showOfferButton && (
          <div className="pt-2">
            <Button 
              onClick={handleSendOffer}
              className="w-full"
              variant="default"
            >
              Enviar Oferta
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BuyRequestCard;
