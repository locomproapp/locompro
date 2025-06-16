
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number;
  max_price: number;
  zone: string;
  condition: string;
  reference_url: string | null;
  status: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

interface BuyRequestInformationProps {
  buyRequest: BuyRequest;
}

const BuyRequestInformation = ({ buyRequest }: BuyRequestInformationProps) => {
  const formatPrice = (min: number, max: number) => {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (min === max) return format(min);
    return `${format(min)} - ${format(max)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCondition = (condition: string) => {
    const conditionMap: { [key: string]: string } = {
      'nuevo': 'Nuevo',
      'usado': 'Usado',
      'cualquiera': 'Cualquier estado'
    };
    return conditionMap[condition] || condition;
  };

  const isActive = buyRequest.status === 'active';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? 'ACTIVA' : 'CERRADA'}
        </Badge>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        {buyRequest.title}
      </h1>
      
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Precio</h3>
          <p className="text-lg text-primary font-bold">
            {formatPrice(buyRequest.min_price, buyRequest.max_price)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Zona</h3>
          <p className="text-base text-foreground">{buyRequest.zone}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Estado</h3>
          <p className="text-base text-foreground">{formatCondition(buyRequest.condition)}</p>
        </div>

        {buyRequest.description && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Descripción</h3>
            <p className="text-base text-foreground whitespace-pre-wrap">{buyRequest.description}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Fecha</h3>
          <p className="text-base text-foreground">{formatDate(buyRequest.created_at)}</p>
        </div>
        
        {buyRequest.profiles?.full_name && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Publicado por</h3>
            <p className="text-base text-foreground">{buyRequest.profiles.full_name}</p>
          </div>
        )}

        {buyRequest.reference_url && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Enlace de referencia</h3>
            <a
              href={buyRequest.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-base"
            >
              Ver ejemplo
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyRequestInformation;
