
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
    <div className="space-y-4 w-full min-w-[260px] max-w-[260px] md:min-w-[320px] md:max-w-[320px]">
      {/* Main card without footer actions - exactly like CompactOfferCard */}
      <Card className="w-full flex-shrink-0 flex flex-col border h-[360px] md:max-h-[400px] md:h-auto">
        <CardHeader className="pb-2 flex-shrink-0">
          <OfferHeader
            profileName={offer.profiles?.full_name}
            createdAt={offer.created_at}
            status={offer.status}
            sellerId={offer.seller_id}
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
        </CardContent>
      </Card>

      {/* External action box for accept/reject buttons - exactly like CompactOfferOwnerActions */}
      {canAcceptOrReject && (
        <div className="w-full max-w-[260px] md:max-w-[320px] bg-background border border-border rounded-lg p-3 min-h-[76px] flex items-center justify-center">
          <OfferActions
            canAcceptOrReject={canAcceptOrReject}
            isAccepting={isAccepting}
            isRejecting={isRejecting}
            onAccept={() => setShowAcceptDialog(true)}
            onReject={() => setShowRejectDialog(true)}
          />
        </div>
      )}

      {/* External rejection reason box - exactly like CompactOfferCard */}
      {offer.status === 'rejected' && offer.rejection_reason && (
        <div className="w-full max-w-[260px] md:max-w-[320px] bg-red-50 border border-red-200 rounded-lg p-3 min-h-[76px] flex items-center justify-center">
          <div className="w-full">
            <p className="text-xs font-medium text-red-800 mb-1">Motivo del rechazo:</p>
            <p className="text-xs text-red-700">{offer.rejection_reason}</p>
          </div>
        </div>
      )}

      {/* Dialogs */}
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
    </div>
  );
};

export default BuyRequestOfferCard;
