import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RejectOfferDialog from '@/components/RejectOfferDialog';

interface CompactOfferActionsProps {
  offerId: string;
  canAcceptOrReject: boolean;
  onStatusUpdate?: () => void;
}

const CompactOfferActions = ({ offerId, canAcceptOrReject, onStatusUpdate }: CompactOfferActionsProps) => {
  const { toast } = useToast();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const acceptOffer = async () => {
    try {
      setIsAccepting(true);
      
      // First, get the offer details and buy request info
      const { data: offerData, error: offerError } = await supabase
        .from('offers')
        .select(`
          id,
          buy_request_id,
          seller_id,
          buy_requests!inner (
            user_id
          )
        `)
        .eq('id', offerId)
        .single();

      if (offerError) throw offerError;

      // Update the accepted offer status
      const { error: updateError } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (updateError) throw updateError;

      // Mark all other offers for this buy request as 'finalized'
      const { error: finalizeError } = await supabase
        .from('offers')
        .update({ 
          status: 'finalized',
          updated_at: new Date().toISOString()
        })
        .eq('buy_request_id', offerData.buy_request_id)
        .neq('id', offerId)
        .eq('status', 'pending');

      if (finalizeError) throw finalizeError;

      // Create or get chat between buyer and seller
      const buyerId = offerData.buy_requests.user_id;
      const sellerId = offerData.seller_id;

      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('buy_request_id', offerData.buy_request_id)
        .eq('buyer_id', buyerId)
        .eq('seller_id', sellerId)
        .single();

      if (!existingChat) {
        // Create new chat
        const { error: chatError } = await supabase
          .from('chats')
          .insert({
            buy_request_id: offerData.buy_request_id,
            buyer_id: buyerId,
            seller_id: sellerId,
            offer_id: offerId
          });

        if (chatError) throw chatError;
      }

      toast({
        title: 'Oferta aceptada',
        description: 'La oferta ha sido aceptada exitosamente. Se ha creado un chat para coordinar la transacción.',
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
        .eq('id', offerId);

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

  if (!canAcceptOrReject) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2 w-full">
        <Button
          onClick={acceptOffer}
          disabled={isAccepting || isRejecting}
          className="flex-1 h-6 px-2.5 py-0.5 text-xs font-semibold rounded-full"
        >
          <Check className="h-3 w-3 mr-1" />
          {isAccepting ? 'Aceptando...' : 'Aceptar'}
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowRejectDialog(true)}
          disabled={isAccepting || isRejecting}
          className="flex-1 h-6 px-2.5 py-0.5 text-xs font-semibold rounded-full"
        >
          <X className="h-3 w-3 mr-1" />
          Rechazar
        </Button>
      </div>

      <RejectOfferDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={handleRejectOffer}
        isLoading={isRejecting}
      />
    </>
  );
};

export default CompactOfferActions;
