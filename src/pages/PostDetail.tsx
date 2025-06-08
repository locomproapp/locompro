
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import SendOfferDialog from '@/components/SendOfferDialog';
import OffersForRequest from '@/components/OffersForRequest';
import PublicOffersList from '@/components/PublicOffersList';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Calendar, ArrowLeft, User, Search } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground">Cargando publicación...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Publicación no encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              La publicación que buscas no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link to="/market">Volver al mercado</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.id === post.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/market" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al mercado
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería de imágenes */}
            <div className="bg-card rounded-lg border border-border p-6">
              <ImageGallery images={post.images || []} />
            </div>

            {/* Información del producto */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  BUSCO
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {post.title}
              </h1>

              {post.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {post.description}
                  </p>
                </div>
              )}

              {post.characteristics && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Características</h3>
                  <pre className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {JSON.stringify(post.characteristics, null, 2)}
                  </pre>
                </div>
              )}

              {post.reference_link && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Enlace de referencia</h3>
                  <a
                    href={post.reference_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver ejemplo
                  </a>
                </div>
              )}
            </div>

            {/* Lista pública de ofertas */}
            <PublicOffersList buyRequestId={post.id} />
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Precio y ubicación */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="mb-4">
                <Badge variant="secondary" className="text-lg font-bold p-2">
                  {formatPrice(post.min_price, post.max_price)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{post.zone}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <Calendar className="h-4 w-4" />
                <span>Publicado el {formatDate(post.created_at)}</span>
              </div>

              {!isOwner && (
                <SendOfferDialog 
                  buyRequestId={post.id}
                  buyRequestTitle={post.title}
                />
              )}
            </div>

            {/* Información del vendedor */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Comprador
              </h3>
              <div className="text-muted-foreground">
                <p className="font-medium">
                  {post.profiles?.full_name || 'Usuario anónimo'}
                </p>
                {post.contact_info && (
                  <div className="mt-2 text-sm">
                    <pre className="bg-muted p-2 rounded text-xs">
                      {JSON.stringify(post.contact_info, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Ofertas recibidas (solo para el dueño) */}
            {isOwner && (
              <div className="bg-card rounded-lg border border-border p-6">
                <OffersForRequest buyRequestId={post.id} />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;
