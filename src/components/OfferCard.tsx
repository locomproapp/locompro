
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, Calendar, Check, X, Star, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Chat from '@/components/Chat';

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
  } | null;
}

interface OfferCardProps {
  offer: Offer;
  showActions?: boolean;
  showPublicInfo?: boolean;
  onStatusUpdate?: () => void;
}

const OfferCard = ({ offer, showActions = false, showPublicInfo = false, onStatusUpdate }: OfferCardProps) => {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'finalized':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'accepted':
        return 'Aceptada';
      case 'rejected':
        return 'Rechazada';
      case 'withdrawn':
        return 'Retirada';
      case 'finalized':
        return 'No seleccionada';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Calendar className="h-3 w-3" />;
      case 'accepted':
        return <Check className="h-3 w-3" />;
      case 'rejected':
        return <X className="h-3 w-3" />;
      case 'finalized':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const updateOfferStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: 'Estado actualizado',
        description: `La oferta ha sido ${newStatus === 'accepted' ? 'aceptada' : 'rechazada'}`,
      });

      onStatusUpdate?.();
    } catch (err) {
      console.error('Error updating offer status:', err);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la oferta',
        variant: 'destructive',
      });
    }
  };

  const renderRating = (rating: number | null | undefined) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating}/5)</span>
      </div>
    );
  };

  const isRequestClosed = offer.buy_requests?.status === 'closed';

  return (
    <div className="space-y-4">
      <Card className={`p-4 ${offer.status === 'rejected' ? 'ring-1 ring-red-200 bg-red-50' : offer.status === 'accepted' ? 'ring-1 ring-green-200 bg-green-50' : ''}`}>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{offer.title}</h3>
              {offer.buy_requests && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Para: {offer.buy_requests.title} ({offer.buy_requests.zone})
                  </p>
                  {isRequestClosed && (
                    <p className="text-xs text-orange-600 font-medium">
                      La solicitud de compra ha sido cerrada
                    </p>
                  )}
                </div>
              )}
              {showPublicInfo && offer.profiles?.full_name && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    Por: {offer.profiles.full_name}
                  </p>
                  {offer.buyer_rating && renderRating(offer.buyer_rating)}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">${offer.price}</div>
              <Badge className={`${getStatusColor(offer.status)} flex items-center gap-1 mt-1`}>
                {getStatusIcon(offer.status)}
                {getStatusText(offer.status)}
              </Badge>
            </div>
          </div>

          {offer.description && (
            <p className="text-muted-foreground text-sm">{offer.description}</p>
          )}

          {/* Show rejection reason prominently */}
          {offer.status === 'rejected' && offer.rejection_reason && (
            <div className="bg-red-100 border border-red-200 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Motivo del rechazo:</p>
                  <p className="text-sm text-red-700">{offer.rejection_reason}</p>
                </div>
              </div>
            </div>
          )}

          {offer.contact_info && (showActions || showPublicInfo) && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Contacto:</h4>
              <div className="flex flex-wrap gap-2">
                {offer.contact_info.email && (
                  <a
                    href={`mailto:${offer.contact_info.email}`}
                    className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    <Mail className="h-3 w-3" />
                    {offer.contact_info.email}
                  </a>
                )}
                {offer.contact_info.phone && (
                  <a
                    href={`tel:${offer.contact_info.phone}`}
                    className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                  >
                    <Phone className="h-3 w-3" />
                    {offer.contact_info.phone}
                  </a>
                )}
                {offer.contact_info.whatsapp && (
                  <a
                    href={`https://wa.me/${offer.contact_info.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                  >
                    <MessageCircle className="h-3 w-3" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(offer.created_at)}</span>
            </div>
          </div>

          {showActions && offer.status === 'pending' && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => updateOfferStatus('accepted')}
                className="flex-1"
                size="sm"
              >
                <Check className="h-4 w-4 mr-1" />
                Aceptar
              </Button>
              <Button
                onClick={() => updateOfferStatus('rejected')}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Rechazar
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Show chat when offer is accepted */}
      {offer.status === 'accepted' && offer.buy_requests && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-800">¡Oferta aceptada! Chatea con el comprador</h4>
          </div>
          <Chat 
            buyRequestId={offer.buy_request_id}
            sellerId={offer.seller_id}
            offerId={offer.id}
          />
        </div>
      )}
    </div>
  );
};

export default OfferCard;
