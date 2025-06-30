
import React, { useState } from 'react';
import { BuyRequestOffer } from '@/types/buyRequestOffer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RejectOfferDialog from '@/components/RejectOfferDialog';
import AcceptOfferDialog from '@/components/AcceptOfferDialog';
import OfferHeader from './BuyRequestOfferCard/OfferHeader';
import OfferContent from './BuyRequestOfferCard/OfferContent';
import OfferActions from './BuyRequestOfferCard/OfferActions';
import RejectionReason from './BuyRequestOfferCard/RejectionReason';

interface BuyRequestOfferCardProps {
  offer: BuyRequestOffer;
  buyRequestOwnerId: string;
  onUpdate: () => void;
}

const BuyRequestOfferCard = ({ offer, buyRequestOwnerId, onUpdate }: BuyRequestOfferCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const isOwner = user?.id === buyRequestOwnerId;
  const canAcceptOrReject = isOwner && offer.status === 'pending';

  const getCardClassName = () => {
    switch (offer.status) {
      case 'accepted':
        return 'ring-1 ring-green-200 bg-green-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
      case 'finalized':
        return 'ring-1 ring-gray-200 bg-gray-50';
      default:
        return '';
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

      setShowAcceptDialog(false);
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
    <div className="space-y-4 w-full">
      <Card className={`w-full flex-shrink-0 flex flex-col border ${getCardClassName()} h-[360px] md:h-auto`}>
        <CardHeader className="pb-2 flex-shrink-0">
          <OfferHeader
            profileName={offer.profiles?.full_name}
            createdAt={offer.created_at}
            status={offer.status}
          />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4 pt-0 min-h-0 justify-between overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <OfferContent
              title={offer.title}
              description={offer.description}
              price={offer.price}
              zone={offer.zone}
              images={offer.images}
              characteristics={offer.characteristics}
            />
          </div>
          
          {/* Action buttons pushed to bottom with consistent spacing */}
          {canAcceptOrReject && (
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border/20 flex-shrink-0">
              <OfferActions
                canAcceptOrReject={canAcceptOrReject}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
                onAccept={() => setShowAcceptDialog(true)}
                onReject={() => setShowRejectDialog(true)}
              />
            </div>
          )}
        </CardContent>

        <AcceptOfferDialog
          open={showAcceptDialog}
          onOpenChange={setShowAcceptDialog}
          onConfirm={acceptOffer}
          isLoading={isAccepting}
        />

        <RejectOfferDialog
          open={showRejectDialog}
          onOpenChange={setShowRejectDialog}
          onConfirm={handleRejectOffer}
          isLoading={isRejecting}
        />
      </Card>

      {/* Rejection reason - separate box below the main card */}
      {offer.status === 'rejected' && offer.rejection_reason && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-medium text-red-800 mb-1">Motivo del rechazo:</p>
          <p className="text-xs text-red-700">{offer.rejection_reason}</p>
        </div>
      )}
    </div>
  );
};

export default BuyRequestOfferCard;
