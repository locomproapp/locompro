import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OfferCard from '@/components/OfferCard';
import { useUserOffers } from '@/hooks/useUserOffers';
import { useAuth } from '@/hooks/useAuth';
import { Package, Search } from 'lucide-react';

const MyOffers = () => {
  const { user } = useAuth();
  const { offers, loading, refetch } = useUserOffers();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Inicia sesión para ver tus ofertas
            </h1>
            <p className="text-muted-foreground">
              Necesitas estar logueado para acceder a esta sección.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Mis Ofertas
          </h1>
          <p className="text-lg text-muted-foreground">
            Gestiona las ofertas que has enviado a compradores
          </p>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground">Cargando tus ofertas...</p>
          </div>
        ) : offers.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {offers.length} {offers.length === 1 ? 'oferta enviada' : 'ofertas enviadas'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onStatusUpdate={refetch} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aún no has enviado ofertas
              </h3>
              <p className="text-muted-foreground mb-6">
                Explora el mercado y envía ofertas a los compradores.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOffers;
