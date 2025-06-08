
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductInfo from '@/components/ProductInfo';
import PriceAndLocation from '@/components/PriceAndLocation';
import BuyerInfo from '@/components/BuyerInfo';
import OffersForRequest from '@/components/OffersForRequest';
import PublicOffersList from '@/components/PublicOffersList';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';

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
            <ProductInfo post={post} />
            <PublicOffersList buyRequestId={post.id} />
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            <PriceAndLocation post={post} isOwner={isOwner} />
            <BuyerInfo post={post} />
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
