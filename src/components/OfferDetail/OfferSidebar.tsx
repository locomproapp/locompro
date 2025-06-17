
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Calendar, ShoppingCart, MapPin } from 'lucide-react';

interface OfferSidebarProps {
  offer: any;
}

const OfferSidebar = ({ offer }: OfferSidebarProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Precio */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            ${offer.price.toLocaleString('es-AR')}
          </div>
          <p className="text-sm text-muted-foreground">Precio de la oferta</p>
        </div>
      </div>

      {/* Información del vendedor */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="h-4 w-4" />
          Vendedor
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={offer.profiles?.avatar_url || undefined} 
                alt={offer.profiles?.full_name || 'Vendedor'} 
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {offer.profiles?.full_name?.charAt(0) || 'V'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                {offer.profiles?.full_name || 'Usuario anónimo'}
              </p>
              <p className="text-sm text-muted-foreground">
                {offer.profiles?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Información del buy request */}
      {offer.buy_requests && typeof offer.buy_requests === 'object' && 'title' in offer.buy_requests && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Solicitud de compra
          </h3>
          
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground">
                {offer.buy_requests.title}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{offer.buy_requests.zone}</span>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link to={`/buy-request/${offer.buy_request_id}`}>
                Ver solicitud completa
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Fechas */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Fechas
        </h3>
        
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Oferta creada:</span>
            <p className="font-medium">{formatDate(offer.created_at)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Última actualización:</span>
            <p className="font-medium">{formatDate(offer.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSidebar;
