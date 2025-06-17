
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useUserOffers } from '@/hooks/useUserOffers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Clock, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOffers = () => {
  const { data: offers = [], isLoading: loading } = useUserOffers();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-500"><Check className="h-3 w-3 mr-1" />Aceptada</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rechazada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mis Ofertas
          </h1>
          <p className="text-muted-foreground">
            Gestiona todas las ofertas que has enviado
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground">Cargando ofertas...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No has enviado ofertas
            </h3>
            <p className="text-muted-foreground mb-6">
              Cuando envíes ofertas aparecerán aquí
            </p>
            <Button asChild>
              <Link to="/marketplace">Explorar solicitudes</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{offer.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Para: {offer.buy_requests?.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Zona: {offer.buy_requests?.zone}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-2">
                        ${offer.price.toLocaleString('es-AR')}
                      </div>
                      {getStatusBadge(offer.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Enviada el {formatDate(offer.created_at)}
                    </p>
                    <Button asChild variant="outline">
                      <Link to={`/buy-request/${offer.buy_request_id}`}>
                        Ver solicitud
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOffers;
