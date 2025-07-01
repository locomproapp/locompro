
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
import SellerActions from './BuyRequestOfferCard/SellerActions';

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
  const isSeller = user?.id === offer.seller_id;
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
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader className="pb-3">
          <OfferHeader
            profileName={offer.profiles?.full_name}
            createdAt={offer.created_at}
            status={offer.status}
            sellerId={offer.seller_id}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          <OfferContent
            title={offer.title}
            description={offer.description}
            price={offer.price}
            zone={offer.zone}
            images={offer.images}
            characteristics={offer.characteristics}
            status={offer.status}
            rejectionReason={offer.rejection_reason}
          />

          <OfferActions
            canAcceptOrReject={canAcceptOrReject}
            isAccepting={isAccepting}
            isRejecting={isRejecting}
            onAccept={() => setShowAcceptDialog(true)}
            onReject={() => setShowRejectDialog(true)}
          />

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
        </CardContent>
      </Card>

      {/* Seller actions outside the card */}
      {isSeller && offer.status === 'rejected' && (
        <SellerActions 
          offerId={offer.id}
          buyRequestId={offer.buy_request_id}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default BuyRequestOfferCard;
