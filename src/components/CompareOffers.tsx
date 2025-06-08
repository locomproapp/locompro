import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Check, Clock, MessageCircle, Truck, X, Trash2, Edit, AlertTriangle } from 'lucide-react';
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
  const [counterOfferMode, setCounterOfferMode] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  // Fetch all offers including rejected ones for public visibility
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
      toast({
        title: "¡Oferta aceptada!",
        description: "Has aceptado la oferta y cerrado la solicitud de compra. Ahora puedes chatear con el vendedor."
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
        description: "La oferta ha sido rechazada y el vendedor será notificado"
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

  // Show chat when an offer is accepted - now with proper user context
  const acceptedOffer = offers?.find(offer => offer.status === 'accepted');
  const showChat = acceptedOffer && user;

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

  // Separate offers by status for better display
  const pendingOffers = offers.filter(offer => offer.status === 'pending');
  const acceptedOffers = offers.filter(offer => offer.status === 'accepted');
  const rejectedOffers = offers.filter(offer => offer.status === 'rejected');
  const finalizedOffers = offers.filter(offer => offer.status === 'finalized');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Ofertas recibidas ({offers.length})
        </h3>
        {isOwner && pendingOffers.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Compara las ofertas y acepta la que más te convenga
          </p>
        )}
      </div>

      {/* Show chat when an offer is accepted - improved version */}
      {showChat && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-800">
              {isOwner ? '¡Oferta aceptada! Chatea con el vendedor' : '¡Tu oferta fue aceptada! Chatea con el comprador'}
            </h4>
          </div>
          <Chat 
            buyRequestId={buyRequestId}
            sellerId={acceptedOffer.seller_id}
            offerId={acceptedOffer.id}
          />
        </div>
      )}

      <div className="grid gap-4">
        {/* Accepted offers first */}
        {acceptedOffers.map((offer) => {
          const isUserOffer = user?.id === offer.seller_id;
          
          return (
            <Card key={offer.id} className="ring-2 ring-green-500">
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

                {isOwner && (
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
              </CardContent>
            </Card>
          );
        })}

        {/* Pending offers */}
        {pendingOffers.map((offer) => {
          const isUserOffer = user?.id === offer.seller_id;
          const isInCounterOfferMode = counterOfferMode === offer.id;
          
          return (
            <Card key={offer.id}>
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

                {isOwner && (
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

                {isUserOffer && !isInCounterOfferMode && (
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
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Rejected offers - visible to everyone for transparency */}
        {rejectedOffers.length > 0 && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="text-md font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Ofertas rechazadas ({rejectedOffers.length})
                <span className="text-xs font-normal">- Visible para otros vendedores como referencia</span>
              </h4>
            </div>
            
            {rejectedOffers.map((offer) => {
              const isUserOffer = user?.id === offer.seller_id;
              const isInCounterOfferMode = counterOfferMode === offer.id;
              
              return (
                <Card key={offer.id} className="ring-2 ring-red-500 bg-red-50 opacity-80">
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
                        <div className="text-2xl font-bold text-red-600">
                          ${offer.price}
                        </div>
                        {getStatusBadge(offer.status)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Show rejection reason prominently for all users */}
                    {offer.rejection_reason && (
                      <div className="bg-red-100 border border-red-300 p-4 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <p className="text-sm font-semibold text-red-800">
                            Motivo del rechazo:
                          </p>
                        </div>
                        <p className="text-sm text-red-700 font-medium pl-6">
                          "{offer.rejection_reason}"
                        </p>
                        <p className="text-xs text-red-600 pl-6 mt-1">
                          💡 Esta información es útil para otros vendedores
                        </p>
                      </div>
                    )}

                    {offer.images && offer.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {offer.images.slice(0, 3).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Producto ${index + 1}`}
                            className="h-20 w-full object-cover rounded opacity-60"
                            onError={(e) => {
                              console.error('Error cargando imagen:', image);
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        ))}
                        {offer.images.length > 3 && (
                          <div className="h-20 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground opacity-60">
                            +{offer.images.length - 3} más
                          </div>
                        )}
                      </div>
                    )}

                    {offer.message && (
                      <div className="bg-white/60 p-3 rounded border">
                        <p className="text-sm font-medium mb-1">Mensaje del vendedor:</p>
                        <p className="text-sm">{offer.message}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      {offer.delivery_time && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span>Entrega: {offer.delivery_time}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(offer.created_at)}</span>
                      </div>
                    </div>

                    {isUserOffer && !isInCounterOfferMode && (
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

                    {isUserOffer && isInCounterOfferMode && (
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-sm">Nuevo precio:</span>
                        <Input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                          className="w-32"
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
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Finalized offers (not selected) */}
        {finalizedOffers.map((offer) => (
          <Card key={offer.id} className="opacity-60">
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
            </CardContent>
          </Card>
        ))}
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
