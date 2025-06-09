
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OfferCard from '@/components/OfferCard';
import SellerNotifications from '@/components/SellerNotifications';
import { useUserOffers } from '@/hooks/useUserOffers';
import { useAuth } from '@/hooks/useAuth';
import { Package, Search, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MyOffers = () => {
  const { user } = useAuth();
  const { offers, loading, refetch } = useUserOffers();

  const handleForceRefresh = async () => {
    console.log('Manual force refresh triggered from MyOffers');
    await refetch();
  };

  // Auto-refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('MyOffers page became visible, refreshing offers');
        refetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetch]);

  // Enhanced global event listener for offer status changes
  useEffect(() => {
    console.log('MyOffers: Setting up enhanced global event listener for immediate refresh');

    const handleOfferStatusChange = (event: CustomEvent) => {
      const { offerId, newStatus } = event.detail;
      console.log('MyOffers: Global offer status change detected, forcing immediate refresh:', { offerId, newStatus });
      
      // Force immediate refresh when any offer status changes
      setTimeout(() => {
        refetch();
      }, 100);
    };

    window.addEventListener('offerStatusChanged', handleOfferStatusChange as EventListener);

    return () => {
      window.removeEventListener('offerStatusChanged', handleOfferStatusChange as EventListener);
    };
  }, [refetch]);

  // Force refresh when component mounts
  useEffect(() => {
    console.log('MyOffers component mounted, forcing refresh');
    refetch();
  }, [refetch]);

  // Now handle the conditional rendering AFTER all hooks have been called
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

  // Count offers by status for better UX
  const pendingOffers = offers.filter(offer => offer.status === 'pending');
  const acceptedOffers = offers.filter(offer => offer.status === 'accepted');
  const rejectedOffers = offers.filter(offer => offer.status === 'rejected');
  const withdrawnOffers = offers.filter(offer => offer.status === 'withdrawn');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Mis Ofertas
              </h1>
              <p className="text-lg text-muted-foreground">
                Gestiona las ofertas que has enviado a compradores
              </p>
            </div>
            <Button
              onClick={handleForceRefresh}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Notifications sidebar */}
          <div className="lg:col-span-1">
            <SellerNotifications />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <p className="text-muted-foreground">Cargando tus ofertas...</p>
              </div>
            ) : offers.length > 0 ? (
              <>
                {/* Status summary */}
                <div className="mb-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Resumen:</strong> {pendingOffers.length} pendiente{pendingOffers.length !== 1 ? 's' : ''}, {acceptedOffers.length} aceptada{acceptedOffers.length !== 1 ? 's' : ''}, {rejectedOffers.length} rechazada{rejectedOffers.length !== 1 ? 's' : ''}, {withdrawnOffers.length} retirada{withdrawnOffers.length !== 1 ? 's' : ''}
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Info about offer management */}
                <div className="mb-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Información importante:</strong> Solo los compradores pueden aceptar o rechazar ofertas. Como vendedor, puedes retirar tus ofertas pendientes si lo deseas.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {offers.map((offer) => (
                    <OfferCard 
                      key={`${offer.id}-${offer.status}-${offer.updated_at}-${Date.now()}`}
                      offer={offer} 
                      onStatusUpdate={refetch}
                      currentUserId={user.id}
                    />
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOffers;
