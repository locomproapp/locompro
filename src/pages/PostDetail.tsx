import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PublicOffersList from '@/components/PublicOffersList';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, ExternalLink } from 'lucide-react';

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

        {/* Redesigned header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-4">
          {/* Left info (2/3 width on desktop) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {post.title}
            </h1>
            
            <div className="font-semibold text-xl text-primary">
              {formatPrice(post.min_price, post.max_price)}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{post.zone}</span>
            </div>

            {formattedCharacteristics && (
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground text-sm">Características:</h3>
                <p className="text-muted-foreground text-sm">{formattedCharacteristics}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Publicado el {formatDate(post.created_at)}</span>
            </div>
            
            {post.profiles?.full_name && (
              <div className="text-sm">
                <span className="font-semibold text-foreground">Publicado por: </span>
                <span className="text-muted-foreground">{post.profiles.full_name}</span>
              </div>
            )}

            {post.reference_link && (
              <div className="text-sm">
                <span className="font-semibold text-foreground">Enlace de referencia: </span>
                <a
                  href={post.reference_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver ejemplo
                </a>
              </div>
            )}
          </div>
          {/* Right image (1/3 width on desktop) */}
          <div className="md:col-span-1 w-full flex items-center justify-center">
            {mainImage ? (
              <img
                src={mainImage}
                alt="Imagen principal"
                className="rounded-lg max-w-xs w-full h-64 object-cover border border-border shadow"
                style={{ background: '#f8fafc' }}
              />
            ) : (
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground border border-border">
                Sin imagen
              </div>
            )}
          </div>
        </div>

        {/* Offers section */}
        <div>
          <PublicOffersList buyRequestId={post.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;
