
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OfferCard from '@/components/OfferCard';
import SellerNotifications from '@/components/SellerNotifications';
import { useUserOffers } from '@/hooks/useUserOffers';
import { useAuth } from '@/hooks/useAuth';
import { Package, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MyOffers = () => {
  const { user } = useAuth();
  const { offers, loading, refetch } = useUserOffers();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOffers = offers.filter(offer => {
    if (statusFilter === 'all') return true;
    return offer.status === statusFilter;
  });

  const getStatusCount = (status: string) => {
    return offers.filter(offer => offer.status === status).length;
  };

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
                {/* Filter controls */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas ({offers.length})</SelectItem>
                          <SelectItem value="pending">Pendientes ({getStatusCount('pending')})</SelectItem>
                          <SelectItem value="accepted">Aceptadas ({getStatusCount('accepted')})</SelectItem>
                          <SelectItem value="rejected">Rechazadas ({getStatusCount('rejected')})</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="sm" onClick={refetch}>
                      Actualizar
                    </Button>
                  </div>
                  <p className="text-muted-foreground">
                    {filteredOffers.length} {filteredOffers.length === 1 ? 'oferta' : 'ofertas'}
                    {statusFilter !== 'all' && ` (${statusFilter})`}
                  </p>
                </div>

                {/* Status summary */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-card rounded-lg border border-border p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{offers.length}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="bg-card rounded-lg border border-yellow-200 p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</div>
                    <div className="text-sm text-muted-foreground">Pendientes</div>
                  </div>
                  <div className="bg-card rounded-lg border border-green-200 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{getStatusCount('accepted')}</div>
                    <div className="text-sm text-muted-foreground">Aceptadas</div>
                  </div>
                  <div className="bg-card rounded-lg border border-red-200 p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{getStatusCount('rejected')}</div>
                    <div className="text-sm text-muted-foreground">Rechazadas</div>
                  </div>
                </div>

                {filteredOffers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredOffers.map((offer) => (
                      <OfferCard key={offer.id} offer={offer} onStatusUpdate={refetch} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No hay ofertas {statusFilter !== 'all' ? statusFilter : ''}
                    </h3>
                    <p className="text-muted-foreground">
                      {statusFilter !== 'all' 
                        ? `No tienes ofertas con estado "${statusFilter}".`
                        : 'Aún no has enviado ofertas.'
                      }
                    </p>
                  </div>
                )}
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
