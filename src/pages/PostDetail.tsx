
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PublicOffersList from '@/components/PublicOffersList';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

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
    if (!min && !max) return 'Precio a consultar';
    if (min && max && min !== max) return `$${min} - $${max}`;
    if (min) return `$${min}`;
    if (max) return `$${max}`;
    return 'Precio a consultar';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Render loading/error
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* Loading icon */}
              <svg className="h-8 w-8 text-primary animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" />
              </svg>
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

  // Main image: show first if images available
  const mainImage = post.images && post.images.length ? post.images[0] : null;

  // Parse and format characteristics if exist
  let formattedCharacteristics = null;
  if (post.characteristics) {
    if (typeof post.characteristics === 'string') {
      formattedCharacteristics = post.characteristics;
    } else if (typeof post.characteristics === 'object') {
      formattedCharacteristics = Object.entries(post.characteristics)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <Button variant="ghost" asChild className="mb-4 self-start">
          <Link to="/market" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al mercado
          </Link>
        </Button>

        {/* Redesigned layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left column: Details */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {post.title}
            </h1>
            
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Precio</h3>
                <p className="text-lg text-primary font-bold">{formatPrice(post.min_price, post.max_price)}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Zona</h3>
                <p className="text-base text-foreground">{post.zone}</p>
              </div>

              {formattedCharacteristics && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Características</h3>
                  <p className="text-base text-foreground whitespace-pre-wrap">{formattedCharacteristics}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Fecha</h3>
                <p className="text-base text-foreground">{formatDate(post.created_at)}</p>
              </div>
              
              {post.profiles?.full_name && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Publicado por</h3>
                  <p className="text-base text-foreground">{post.profiles.full_name}</p>
                </div>
              )}

              {post.reference_link && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Enlace de referencia</h3>
                  <a
                    href={post.reference_link}
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
          
          {/* Right column: Image */}
          <div className="w-full flex items-start justify-center md:justify-end">
            {mainImage ? (
              <img
                src={mainImage}
                alt="Imagen principal"
                className="rounded-lg w-full max-w-md h-auto object-cover border border-border shadow-lg"
              />
            ) : (
              <div className="w-full aspect-square max-w-md bg-muted rounded-lg flex items-center justify-center text-muted-foreground border border-border">
                Sin imagen
              </div>
            )}
          </div>
        </div>

        {/* Offers section */}
        <div className="border-t border-border pt-8 mt-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Ofertas Recibidas</h2>
          <PublicOffersList buyRequestId={post.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;
