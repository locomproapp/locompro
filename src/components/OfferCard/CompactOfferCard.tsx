
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, MapPin, Calendar, Image as ImageIcon, ChevronLeft, ChevronRight, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RejectOfferDialog from '@/components/RejectOfferDialog';
import ImageLightbox from '@/components/ImageLightbox';
import { Link } from 'react-router-dom';

interface Offer {
  id: string;
  buy_request_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  contact_info: any;
  status: string;
  rejection_reason: string | null;
  delivery_time: string | null;
  created_at: string;
  updated_at: string;
  buyer_rating?: number | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
  buy_requests?: {
    title: string;
    zone: string;
    status: string;
    user_id?: string;
  } | null;
}

interface CompactOfferCardProps {
  offer: Offer;
  buyRequestOwnerId?: string;
  onStatusUpdate?: () => void;
}

const CompactOfferCard = ({ offer, buyRequestOwnerId, onStatusUpdate }: CompactOfferCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === buyRequestOwnerId;
  const isOfferOwner = user?.id === offer.seller_id;
  const canAcceptOrReject = isOwner && offer.status === 'pending';

  const formatExactDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    switch (offer.status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aceptada</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>;
      case 'finalized':
        return <Badge variant="secondary">Finalizada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'nuevo': return 'Nuevo';
      case 'usado-excelente': return 'Usado - Excelente estado';
      case 'usado-muy-bueno': return 'Usado - Muy buen estado';
      case 'usado-bueno': return 'Usado - Buen estado';
      case 'usado-regular': return 'Usado - Estado regular';
      case 'refurbished': return 'Reacondicionado';
      case 'para-repuestos': return 'Para repuestos';
      default: return condition;
    }
  };

  const acceptOffer = async () => {
    try {
      setIsAccepting(true);
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: 'Oferta aceptada',
        description: 'La oferta ha sido aceptada exitosamente',
      });

      onStatusUpdate?.();
    } catch (err) {
      console.error('Error accepting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo aceptar la oferta',
        variant: 'destructive',
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectOffer = async (rejectionReason: string): Promise<void> => {
    try {
      setIsRejecting(true);
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: 'Oferta rechazada',
        description: 'La oferta ha sido rechazada exitosamente',
      });

      onStatusUpdate?.();
    } catch (err) {
      console.error('Error rejecting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo rechazar la oferta',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDeleteOffer = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: 'Oferta eliminada',
        description: 'La oferta ha sido eliminada exitosamente',
      });

      onStatusUpdate?.();
    } catch (err) {
      console.error('Error deleting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la oferta',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const goToPrevious = () => {
    if (offer.images && offer.images.length > 0) {
      setSelectedImageIndex((prevIndex) => 
        prevIndex === 0 ? offer.images!.length - 1 : prevIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (offer.images && offer.images.length > 0) {
      setSelectedImageIndex((prevIndex) => 
        prevIndex === offer.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <>
      <Card className={`w-80 flex-shrink-0 ${
        offer.status === 'rejected' ? 'ring-1 ring-red-200 bg-red-50' : 
        offer.status === 'accepted' ? 'ring-1 ring-green-200 bg-green-50' : ''
      }`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={undefined} alt={offer.profiles?.full_name || 'Usuario'} />
                <AvatarFallback className="text-xs">
                  {offer.profiles?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-sm text-foreground">
                  {offer.profiles?.full_name || 'Usuario anónimo'}
                </h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatExactDate(offer.created_at)}
                </div>
              </div>
            </div>
            {getStatusBadge()}
          </div>
          
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
            {offer.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-3 flex-1 flex flex-col">
          {/* Image section */}
          <div className="relative h-24 bg-muted rounded border">
            {offer.images && offer.images.length > 0 ? (
              <>
                <button 
                  onClick={() => setLightboxOpen(true)} 
                  className="w-full h-full rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Ver imagen en tamaño completo"
                >
                  <img
                    src={offer.images[selectedImageIndex]}
                    alt={`${offer.title} ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>

                {offer.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPrevious}
                      className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-6 w-6"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNext}
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-6 w-6"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>

                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {selectedImageIndex + 1}/{offer.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Price and location */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-primary">
              ${offer.price.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{offer.contact_info?.zone || 'No especificada'}</span>
            </div>
          </div>

          {/* Condition and delivery */}
          <div className="space-y-1 text-xs">
            {offer.contact_info?.condition && (
              <div>
                <span className="font-medium">Estado: </span>
                <span className="text-muted-foreground">{getConditionText(offer.contact_info.condition)}</span>
              </div>
            )}
            {offer.delivery_time && (
              <div>
                <span className="font-medium">Envío: </span>
                <span className="text-muted-foreground">{offer.delivery_time}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {offer.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{offer.description}</p>
          )}

          {/* Accept/Reject Actions for buy request owner */}
          {canAcceptOrReject && (
            <div className="flex gap-2 mt-auto">
              <Button
                onClick={acceptOffer}
                disabled={isAccepting || isRejecting}
                size="sm"
                className="flex-1 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                {isAccepting ? 'Aceptando...' : 'Aceptar'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectDialog(true)}
                disabled={isAccepting || isRejecting}
                size="sm"
                className="flex-1 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Rechazar
              </Button>
            </div>
          )}
        </CardContent>

        {/* Rejection reason for rejected offers */}
        {offer.status === 'rejected' && offer.rejection_reason && (
          <div className="px-4 pb-3">
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <p className="text-xs font-medium text-red-800">Motivo del rechazo:</p>
              <p className="text-xs text-red-700 mt-1 line-clamp-2">{offer.rejection_reason}</p>
            </div>
          </div>
        )}

        {/* Edit/Delete buttons for offer owner */}
        {isOfferOwner && (
          <div className="px-4 pb-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1 text-xs"
              >
                <Link to={`/send-offer/${offer.buy_request_id}?edit=${offer.id}`}>
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteOffer}
                disabled={isDeleting}
                className="flex-1 text-xs text-destructive hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>

            {/* Counter-offer button only for rejected offers */}
            {offer.status === 'rejected' && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Link to={`/send-offer/${offer.buy_request_id}?edit=${offer.id}`}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Contraofertar
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <RejectOfferDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={handleRejectOffer}
        isLoading={isRejecting}
      />

      {offer.images && offer.images.length > 0 && (
        <ImageLightbox
          images={offer.images}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          startIndex={selectedImageIndex}
        />
      )}
    </>
  );
};

export default CompactOfferCard;
