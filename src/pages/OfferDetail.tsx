
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import ContactInfo from '@/components/OfferCard/ContactInfo';
import RejectionReason from '@/components/OfferCard/RejectionReason';
import Chat from '@/components/Chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, Calendar, User, ShoppingCart, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const OfferDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: offer, isLoading, error } = useQuery({
    queryKey: ['offer', id],
    queryFn: async () => {
      if (!id) throw new Error('Offer ID is required');
      
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          profiles (
            full_name,
            email,
            avatar_url
          ),
          buy_requests (
            title,
            zone,
            status,
            user_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'destructive';
      case 'withdrawn': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'withdrawn': return 'Retirada';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando detalles de la oferta...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Oferta no encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              La oferta que buscas no existe o ha sido eliminada.
            </p>
            <Button onClick={() => navigate(-1)}>
              Volver
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isSeller = user?.id === offer.seller_id;
  const isBuyer = user?.id === offer.buy_requests?.user_id;
  const shouldShowChat = offer.status === 'accepted' && user && offer.buy_requests;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de la oferta */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={getStatusColor(offer.status)}>
                  {getStatusText(offer.status)}
                </Badge>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {offer.title}
              </h1>

              {offer.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {offer.description}
                  </p>
                </div>
              )}

              {/* Galería de imágenes */}
              {offer.images && offer.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-4">Imágenes</h3>
                  <ImageGallery images={offer.images} />
                </div>
              )}

              {/* Razón de rechazo */}
              {offer.status === 'rejected' && offer.rejection_reason && (
                <div className="mb-6">
                  <RejectionReason rejectionReason={offer.rejection_reason} />
                </div>
              )}

              {/* Información de contacto */}
              {offer.contact_info && (offer.status === 'accepted' || isSeller || isBuyer) && (
                <div className="mb-6">
                  <ContactInfo contactInfo={offer.contact_info} />
                </div>
              )}
            </div>

            {/* Chat si la oferta está aceptada */}
            {shouldShowChat && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-800">
                    {isSeller ? '¡Oferta aceptada! Chatea con el comprador' : '¡Oferta aceptada! Chatea con el vendedor'}
                  </h4>
                </div>
                <Chat 
                  buyRequestId={offer.buy_request_id}
                  sellerId={offer.seller_id}
                  offerId={offer.id}
                />
              </div>
            )}
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Precio */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  ${offer.price}
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
            {offer.buy_requests && (
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OfferDetail;
