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
import { ArrowLeft, Tag } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';

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

  const formatCondition = (condition: string | null) => {
    if (!condition) return 'No especificado';
    const map: { [key: string]: string } = {
      'nuevo': 'Nuevo',
      'usado': 'Usado',
      'cualquiera': 'Cualquiera'
    };
    return map[condition] || condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  const allImages = buyRequest.images?.length 
    ? buyRequest.images 
    : (buyRequest.reference_image ? [buyRequest.reference_image] : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <Button variant="ghost" asChild className="mb-4 self-start">
          <Link to="/marketplace" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al mercado
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN - DETAILS & USER INFO */}
          <div className="flex flex-col gap-8">
            
            {/* DETAILS BLOCK */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 flex-wrap">
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

                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {buyRequest.title}
                </h1>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Precio</h3>
                    <p className="text-lg text-primary font-bold">{formatPrice(buyRequest.min_price, buyRequest.max_price)}</p>
                  </div>

                  {buyRequest.condition && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Condición del producto</h3>
                      <p className="text-base text-foreground">{formatCondition(buyRequest.condition)}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Zona</h3>
                    <p className="text-base text-foreground">{buyRequest.zone}</p>
                  </div>

                  <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Características</h3>
                      <p className="text-base text-foreground whitespace-pre-wrap">
                        {buyRequest.description || 'No se especificaron características.'}
                      </p>
                  </div>
                </div>
              </div>
            </div>

            {/* USER INFO BLOCK */}
            <div className="bg-card rounded-lg border border-border p-6 space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Fecha de publicación</h3>
                <p className="text-base text-foreground">{formatDate(buyRequest.created_at)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Publicado por</h3>
                <div className="flex items-center gap-3 mt-2">
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
              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN - IMAGE & REFERENCE LINK */}
          <div className="flex flex-col gap-4 sticky top-24">
            <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
              <ImageGallery images={allImages} />
            </div>
            {buyRequest.reference_url && (
              <Button asChild className="w-full">
                <a href={buyRequest.reference_url} target="_blank" rel="noopener noreferrer">
                  Ver enlace de referencia
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* OFFERS SECTION */}
        {!isOwner && isActive && (
          <div className="pt-8 border-t border-border mt-8">
            <OfferForm 
              buyRequestId={buyRequest.id}
              buyRequestTitle={buyRequest.title}
            />
          </div>
        )}

        <div className="border-t border-border pt-8 mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Ofertas Recibidas</h2>
          <CompareOffers buyRequestId={buyRequest.id} isOwner={isOwner} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyRequestDetail;
