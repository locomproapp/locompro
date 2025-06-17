
import React, { useState } from 'react';
import { BuyRequestOffer } from '@/types/buyRequestOffer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RejectOfferDialog from '@/components/RejectOfferDialog';

interface BuyRequestOfferCardProps {
  offer: BuyRequestOffer;
  buyRequestOwnerId: string;
  onUpdate: () => void;
}

const BuyRequestOfferCard = ({ offer, buyRequestOwnerId, onUpdate }: BuyRequestOfferCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const isOwner = user?.id === buyRequestOwnerId;
  const canAcceptOrReject = isOwner && offer.status === 'pending';

  const getStatusBadge = () => {
    switch (offer.status) {
      case 'pending':
        return <Badge variant="default">Pendiente</Badge>;
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

  const acceptOffer = async () => {
    try {
      setIsAccepting(true);
      const { error } = await supabase
        .from('buy_request_offers')
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

      onUpdate();
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
        .from('buy_request_offers')
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

      onUpdate();
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={undefined} alt={offer.profiles?.full_name || 'Usuario'} />
              <AvatarFallback>
                {offer.profiles?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">
                {offer.profiles?.full_name || 'Usuario anónimo'}
              </h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(offer.created_at), { 
                  addSuffix: true, 
                  locale: es 
                })}
              </div>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-2">{offer.title}</h3>
          {offer.description && (
            <p className="text-muted-foreground text-sm">{offer.description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-primary">
            ${offer.price.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{offer.zone}</span>
          </div>
        </div>

        {offer.images && offer.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {offer.images.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${offer.title} ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
            ))}
            {offer.images.length > 3 && (
              <div className="w-full h-20 bg-muted rounded border flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  +{offer.images.length - 3} más
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-20 bg-muted rounded border flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        {offer.characteristics && (
          <div className="text-sm">
            <strong>Características:</strong>
            <pre className="mt-1 text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(offer.characteristics, null, 2)}
            </pre>
          </div>
        )}

        {offer.status === 'rejected' && offer.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm font-medium text-red-800">Motivo del rechazo:</p>
            <p className="text-sm text-red-700 mt-1">{offer.rejection_reason}</p>
          </div>
        )}

        {canAcceptOrReject && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={acceptOffer}
              disabled={isAccepting || isRejecting}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              {isAccepting ? 'Aceptando...' : 'Aceptar'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowRejectDialog(true)}
              disabled={isAccepting || isRejecting}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
          </div>
        )}

        <RejectOfferDialog
          open={showRejectDialog}
          onOpenChange={setShowRejectDialog}
          onConfirm={handleRejectOffer}
          isLoading={isRejecting}
        />
      </CardContent>
    </Card>
  );
};

export default BuyRequestOfferCard;
