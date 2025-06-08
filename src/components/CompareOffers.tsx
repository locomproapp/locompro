import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Check, Clock, MessageCircle, Truck, X, Trash2, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import RejectOfferDialog from './RejectOfferDialog';
import Chat from './Chat';
import { Link } from 'react-router-dom';

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
  rejection_reason: string | null;
  created_at: string;
  seller_id: string;
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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [offerToReject, setOfferToReject] = useState<string | null>(null);
  const [acceptedOfferId, setAcceptedOfferId] = useState<string | null>(null);
  const [counterOfferMode, setCounterOfferMode] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  const { data: offers, isLoading } = useQuery({
    queryKey: ['offers', buyRequestId],
    queryFn: async () => {
      console.log('Cargando ofertas para buy request:', buyRequestId);
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
      
      if (error) {
        console.error('Error cargando ofertas:', error);
        throw error;
      }
      console.log('Ofertas cargadas:', data);
      return data as Offer[];
    }
  });

  const acceptOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      console.log('Iniciando proceso de aceptar oferta:', offerId);
      
      // Update the accepted offer status
      const { error: offerError } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId);

      if (offerError) {
        console.error('Error aceptando oferta:', offerError);
        throw offerError;
      }

      // Reject all other offers for this buy request
      const { error: rejectError } = await supabase
        .from('offers')
        .update({ status: 'finalized' })
        .eq('buy_request_id', buyRequestId)
        .neq('id', offerId);

      if (rejectError) {
        console.error('Error finalizando otras ofertas:', rejectError);
        throw rejectError;
      }

      // Close the buy request
      const { error: requestError } = await supabase
        .from('buy_requests')
        .update({ status: 'closed' })
        .eq('id', buyRequestId);

      if (requestError) {
        console.error('Error cerrando buy request:', requestError);
        throw requestError;
      }

      console.log('Oferta aceptada exitosamente');
      return offerId;
    },
    onSuccess: (offerId) => {
      setAcceptedOfferId(offerId);
      toast({
        title: "¡Oferta aceptada!",
        description: "Has aceptado la oferta y cerrado la solicitud de compra"
      });
      queryClient.invalidateQueries({ queryKey: ['offers', buyRequestId] });
      queryClient.invalidateQueries({ queryKey: ['buy-request', buyRequestId] });
    },
    onError: (error) => {
      console.error('Error en mutación de aceptar oferta:', error);
      toast({
        title: "Error",
        description: "No se pudo aceptar la oferta. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  });

  const rejectOfferMutation = useMutation({
    mutationFn: async ({ offerId, reason }: { offerId: string; reason: string }) => {
      console.log('Rechazando oferta:', offerId, 'con motivo:', reason);
      
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'rejected',
          rejection_reason: reason 
        })
        .eq('id', offerId);

      if (error) {
        console.error('Error rechazando oferta:', error);
        throw error;
      }
      console.log('Oferta rechazada exitosamente');
    },
    onSuccess: () => {
      toast({
        title: "Oferta rechazada",
        description: "La oferta ha sido rechazada"
      });
      queryClient.invalidateQueries({ queryKey: ['offers', buyRequestId] });
      setRejectDialogOpen(false);
      setOfferToReject(null);
    },
    onError: (error) => {
      console.error('Error en mutación de rechazar oferta:', error);
      toast({
        title: "Error",
        description: "No se pudo rechazar la oferta. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  });

  const deleteOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      console.log('Eliminando oferta:', offerId);
      
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) {
        console.error('Error eliminando oferta:', error);
        throw error;
      }
      console.log('Oferta eliminada exitosamente');
    },
    onSuccess: () => {
      toast({
        title: "Oferta eliminada",
        description: "Tu oferta ha sido eliminada"
      });
      queryClient.invalidateQueries({ queryKey: ['offers', buyRequestId] });
    },
    onError: (error) => {
      console.error('Error en mutación de eliminar oferta:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la oferta. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  });

  const counterOfferMutation = useMutation({
    mutationFn: async ({ offerId, newPrice }: { offerId: string; newPrice: number }) => {
      console.log('Enviando contraoferta:', offerId, 'nuevo precio:', newPrice);
      
      const { error } = await supabase
        .from('offers')
        .update({ 
          price: newPrice,
          status: 'pending',
          rejection_reason: null
        })
        .eq('id', offerId);

      if (error) {
        console.error('Error enviando contraoferta:', error);
        throw error;
      }
      console.log('Contraoferta enviada exitosamente');
    },
    onSuccess: () => {
      toast({
        title: "Contraoferta enviada",
        description: "Tu contraoferta ha sido enviada con el nuevo precio"
      });
      queryClient.invalidateQueries({ queryKey: ['offers', buyRequestId] });
      setCounterOfferMode(null);
      setNewPrice(0);
    },
    onError: (error) => {
      console.error('Error en mutación de contraoferta:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la contraoferta. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  });

  const handleRejectOffer = (offerId: string) => {
    setOfferToReject(offerId);
    setRejectDialogOpen(true);
  };

  const confirmRejectOffer = (reason: string) => {
    if (offerToReject) {
      rejectOfferMutation.mutate({ offerId: offerToReject, reason });
    }
  };

  const handleCounterOffer = (offerId: string, currentPrice: number) => {
    setCounterOfferMode(offerId);
    setNewPrice(currentPrice);
  };

  const submitCounterOffer = (offerId: string) => {
    if (newPrice > 0) {
      counterOfferMutation.mutate({ offerId, newPrice });
    }
  };

  const cancelCounterOffer = () => {
    setCounterOfferMode(null);
    setNewPrice(0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-500"><Check className="h-3 w-3 mr-1" />Aceptada</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-500"><X className="h-3 w-3 mr-1" />Rechazada</Badge>;
      case 'finalized':
        return <Badge variant="outline" className="text-muted-foreground">No seleccionada</Badge>;
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

  const acceptedOffer = offers?.find(offer => offer.status === 'accepted');
  const showChat = acceptedOffer && isOwner;

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

      {showChat && (
        <Chat 
          buyRequestId={buyRequestId}
          sellerId={acceptedOffer.seller_id}
          offerId={acceptedOffer.id}
        />
      )}

      <div className="grid gap-4">
        {offers.map((offer) => {
          const isUserOffer = user?.id === offer.seller_id;
          const isRejected = offer.status === 'rejected';
          const isFinalized = offer.status === 'finalized';
          const isInCounterOfferMode = counterOfferMode === offer.id;
          
          return (
            <Card key={offer.id} className={`${
              offer.status === 'accepted' ? 'ring-2 ring-green-500' : 
              isRejected ? 'ring-2 ring-red-500 bg-red-50' :
              isFinalized ? 'opacity-60' : ''
            }`}>
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
                    {isInCounterOfferMode ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                          className="w-24"
                          step="0.01"
                          min="0.01"
                        />
                        <Button
                          size="sm"
                          onClick={() => submitCounterOffer(offer.id)}
                          disabled={newPrice <= 0 || counterOfferMutation.isPending}
                        >
                          Enviar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelCounterOffer}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-primary">
                        ${offer.price}
                      </div>
                    )}
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
                        onError={(e) => {
                          console.error('Error cargando imagen:', image);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ))}
                    {offer.images.length > 3 && (
                      <div className="h-20 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                        +{offer.images.length - 3} más
                      </div>
                    )}
                  </div>
                )}

                {(!offer.images || offer.images.length === 0) && (
                  <div className="h-20 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                    Sin imágenes
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

                {isRejected && offer.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded">
                    <p className="text-sm font-medium text-red-800 mb-1">Motivo del rechazo:</p>
                    <p className="text-sm text-red-700">{offer.rejection_reason}</p>
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
                </div>

                {/* Botones para el propietario de la solicitud */}
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
                      onClick={() => handleRejectOffer(offer.id)}
                      disabled={rejectOfferMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Botones para ofertas rechazadas del vendedor */}
                {isUserOffer && isRejected && !isInCounterOfferMode && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => deleteOfferMutation.mutate(offer.id)}
                      disabled={deleteOfferMutation.isPending}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar oferta
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleCounterOffer(offer.id, offer.price)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Contraofertar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <RejectOfferDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={confirmRejectOffer}
        isLoading={rejectOfferMutation.isPending}
      />
    </div>
  );
};

export default CompareOffers;
