
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Clock, Star, MessageCircle, Truck, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Offer {
  id: string;
  title: string;
  description: string | null;
  price: number;
  message: string | null;
  delivery_time: string | null;
  images: string[] | null;
  contact_info: any;
  status: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface CompareOffersProps {
  buyRequestId: string;
  isOwner: boolean;
}

const CompareOffers = ({ buyRequestId, isOwner }: CompareOffersProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: offers, isLoading } = useQuery({
    queryKey: ['offers', buyRequestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('buy_request_id', buyRequestId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Offer[];
    }
  });

  const acceptOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      // Update the accepted offer status
      const { error: offerError } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId);

      if (offerError) throw offerError;

      // Reject all other offers for this buy request
      const { error: rejectError } = await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('buy_request_id', buyRequestId)
        .neq('id', offerId);

      if (rejectError) throw rejectError;

      // Close the buy request
      const { error: requestError } = await supabase
        .from('buy_requests')
        .update({ status: 'closed' })
        .eq('id', buyRequestId);

      if (requestError) throw requestError;
    },
    onSuccess: () => {
      toast({
        title: "¡Oferta aceptada!",
        description: "Has aceptado la oferta y cerrado la solicitud de compra"
      });
      queryClient.invalidateQueries({ queryKey: ['offers', buyRequestId] });
      queryClient.invalidateQueries({ queryKey: ['buy-request', buyRequestId] });
    },
    onError: (error) => {
      console.error('Error accepting offer:', error);
      toast({
        title: "Error",
        description: "No se pudo aceptar la oferta",
        variant: "destructive"
      });
    }
  });

  const rejectOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('id', offerId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Oferta rechazada",
        description: "La oferta ha sido rechazada"
      });
      queryClient.invalidateQueries({ queryKey: ['offers', buyRequestId] });
    },
    onError: (error) => {
      console.error('Error rejecting offer:', error);
      toast({
        title: "Error",
        description: "No se pudo rechazar la oferta",
        variant: "destructive"
      });
    }
  });

  const formatContactInfo = (contactInfo: any) => {
    if (!contactInfo) return null;
    if (typeof contactInfo === 'string') return contactInfo;
    if (typeof contactInfo === 'object') {
      return Object.entries(contactInfo)
        .map(([key, value]) => `${value}`)
        .join(', ');
    }
    return String(contactInfo);
  };

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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Cargando ofertas...</p>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Aún no hay ofertas para esta solicitud</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Ofertas recibidas ({offers.length})
        </h3>
        {isOwner && offers.some(offer => offer.status === 'pending') && (
          <p className="text-sm text-muted-foreground">
            Compara las ofertas y acepta la que más te convenga
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className={`${offer.status === 'accepted' ? 'ring-2 ring-green-500' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={offer.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {offer.profiles?.full_name?.charAt(0) || 'V'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Por: {offer.profiles?.full_name || 'Vendedor anónimo'}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    ${offer.price}
                  </div>
                  {getStatusBadge(offer.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {offer.images && offer.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {offer.images.slice(0, 3).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Producto ${index + 1}`}
                      className="h-20 w-full object-cover rounded"
                    />
                  ))}
                  {offer.images.length > 3 && (
                    <div className="h-20 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                      +{offer.images.length - 3} más
                    </div>
                  )}
                </div>
              )}

              {offer.message && (
                <div className="bg-muted p-3 rounded">
                  <p className="text-sm font-medium mb-1">Mensaje del vendedor:</p>
                  <p className="text-sm">{offer.message}</p>
                </div>
              )}

              {offer.description && (
                <div>
                  <p className="text-sm font-medium mb-1">Descripción:</p>
                  <p className="text-sm text-muted-foreground">{offer.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {offer.delivery_time && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>Entrega: {offer.delivery_time}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(offer.created_at)}</span>
                </div>

                {offer.contact_info && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{formatContactInfo(offer.contact_info)}</span>
                  </div>
                )}
              </div>

              {isOwner && offer.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => acceptOfferMutation.mutate(offer.id)}
                    disabled={acceptOfferMutation.isPending}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aceptar oferta
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => rejectOfferMutation.mutate(offer.id)}
                    disabled={rejectOfferMutation.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompareOffers;
