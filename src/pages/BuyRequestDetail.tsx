
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OfferForm from '@/components/OfferForm';
import CompareOffers from '@/components/CompareOffers';
import { useBuyRequestDetail } from '@/hooks/useBuyRequestDetail';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, Calendar, User, Tag } from 'lucide-react';

const BuyRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: buyRequest, isLoading, error } = useBuyRequestDetail(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando solicitud...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !buyRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Solicitud no encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              La solicitud que buscas no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link to="/marketplace">Volver al marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.id === buyRequest.user_id;
  const isActive = buyRequest.status === 'active';

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
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/marketplace" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al marketplace
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del producto */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? 'ACTIVA' : 'CERRADA'}
                </Badge>
                {buyRequest.categories && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {buyRequest.categories.name}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {buyRequest.title}
              </h1>

              {buyRequest.reference_image && (
                <div className="mb-6">
                  <img
                    src={buyRequest.reference_image}
                    alt="Imagen de referencia"
                    className="w-full max-w-md h-64 object-cover rounded"
                  />
                </div>
              )}

              {buyRequest.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {buyRequest.description}
                  </p>
                </div>
              )}
            </div>

            {/* Ofertas */}
            <div className="bg-card rounded-lg border border-border p-6">
              <CompareOffers buyRequestId={buyRequest.id} isOwner={isOwner} />
            </div>
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Precio y ubicación */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="mb-4">
                <Badge variant="secondary" className="text-lg font-bold p-2">
                  {formatPrice(buyRequest.min_price, buyRequest.max_price)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{buyRequest.zone}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <Calendar className="h-4 w-4" />
                <span>Publicado el {formatDate(buyRequest.created_at)}</span>
              </div>

              {!isOwner && isActive && (
                <OfferForm 
                  buyRequestId={buyRequest.id}
                  buyRequestTitle={buyRequest.title}
                />
              )}
            </div>

            {/* Información del comprador */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Comprador
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={buyRequest.profiles?.avatar_url || undefined} 
                      alt={buyRequest.profiles?.full_name || 'Usuario'} 
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {buyRequest.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {buyRequest.profiles?.full_name || 'Usuario anónimo'}
                    </p>
                    {buyRequest.profiles?.location && (
                      <p className="text-sm text-muted-foreground">
                        {buyRequest.profiles.location}
                      </p>
                    )}
                  </div>
                </div>

                {buyRequest.profiles?.bio && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {buyRequest.profiles.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyRequestDetail;
