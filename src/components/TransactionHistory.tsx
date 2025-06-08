
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShoppingBag, Tag, Clock, Check, X, Star } from 'lucide-react';
import ReviewForm from './ReviewForm';

interface BuyRequest {
  id: string;
  title: string;
  status: string;
  created_at: string;
  min_price: number | null;
  max_price: number | null;
}

interface Offer {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  buy_request_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  posts: {
    title: string;
  } | null;
}

const TransactionHistory = () => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);

  // Fetch user's buy requests
  const { data: buyRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ['user-buy-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('buy_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BuyRequest[];
    },
    enabled: !!user
  });

  // Fetch user's offers
  const { data: offers, isLoading: loadingOffers } = useQuery({
    queryKey: ['user-offers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          ),
          posts:buy_requests (
            title
          )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Offer[];
    },
    enabled: !!user
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default"><Clock className="h-3 w-3 mr-1" />Activa</Badge>;
      case 'closed':
        return <Badge variant="secondary"><Check className="h-3 w-3 mr-1" />Cerrada</Badge>;
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
      month: 'short',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Inicia sesión para ver tu historial</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Historial de transacciones</h2>
      
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Mis solicitudes de compra
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Mis ofertas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {loadingRequests ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando solicitudes...</p>
            </div>
          ) : !buyRequests || buyRequests.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes solicitudes de compra</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {buyRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Creada el {formatDate(request.created_at)}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-semibold">
                          {formatPrice(request.min_price, request.max_price)}
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm">
                      <a href={`/buy-request/${request.id}`}>Ver detalles</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          {loadingOffers ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando ofertas...</p>
            </div>
          ) : !offers || offers.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No has enviado ofertas</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {offers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">
                          Para: {offer.posts?.title || 'Solicitud eliminada'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Enviada el {formatDate(offer.created_at)}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-xl font-bold text-primary">
                          ${offer.price}
                        </div>
                        {getStatusBadge(offer.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Button asChild variant="outline" size="sm">
                        <a href={`/buy-request/${offer.buy_request_id}`}>Ver solicitud</a>
                      </Button>
                      
                      {offer.status === 'accepted' && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            ¡Felicitaciones! Tu oferta fue aceptada
                          </span>
                          {showReviewForm === offer.id ? (
                            <ReviewForm
                              offerId={offer.id}
                              onReviewSubmitted={() => setShowReviewForm(null)}
                              onCancel={() => setShowReviewForm(null)}
                            />
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowReviewForm(offer.id)}
                              className="flex items-center gap-1"
                            >
                              <Star className="h-3 w-3" />
                              Calificar comprador
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionHistory;
