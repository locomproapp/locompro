
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
      console.log('CompactOfferActions: Starting accept process for offer:', offerId);
      
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

      if (offerError) {
        console.error('CompactOfferActions: Error fetching offer data:', offerError);
        throw offerError;
      }

      console.log('CompactOfferActions: Offer data:', offerData);

      // Update the accepted offer status
      const { error: updateError } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (updateError) {
        console.error('CompactOfferActions: Database error:', updateError);
        throw updateError;
      }

      console.log('CompactOfferActions: Database update successful');

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

      if (finalizeError) {
        console.error('CompactOfferActions: Error finalizing other offers:', finalizeError);
        throw finalizeError;
      }

      // Create or get chat between buyer and seller
      const buyerId = offerData.buy_requests.user_id;
      const sellerId = offerData.seller_id;

      console.log('CompactOfferActions: Creating chat between buyer:', buyerId, 'and seller:', sellerId);

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

        if (chatError) {
          console.error('CompactOfferActions: Error creating chat:', chatError);
          throw chatError;
        }

        console.log('CompactOfferActions: Chat created successfully');
      } else {
        console.log('CompactOfferActions: Chat already exists');
      }

      toast({
        title: '¡Oferta aceptada!',
        description: 'La oferta ha sido aceptada exitosamente. Se ha creado un chat para coordinar la transacción.',
      });

      // Force immediate callback
      if (onStatusUpdate) {
        console.log('CompactOfferActions: Triggering status update callback');
        onStatusUpdate();
        setTimeout(() => {
          onStatusUpdate();
        }, 500);
      }

      // Force a complete page refresh to ensure all offers show the correct status
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      console.error('CompactOfferActions: Error accepting offer:', err);
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

      if (onStatusUpdate) {
        onStatusUpdate();
        setTimeout(() => {
          onStatusUpdate();
        }, 500);
      }
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
      <div className="flex items-center justify-center gap-2 md:gap-3 w-full px-0 md:px-1 box-border">
        <Button
          onClick={acceptOffer}
          disabled={isAccepting || isRejecting}
          size="sm"
          className="flex-1 text-xs min-h-[36px] h-9 px-2 md:px-3 min-w-0 max-w-none md:min-w-[100px] bg-blue-500 hover:bg-blue-600 text-white border-0 flex items-center justify-center"
        >
          <Check className="h-3 w-3 mr-1 md:mr-1.5 flex-shrink-0" />
          <span className="whitespace-nowrap">{isAccepting ? 'Aceptando...' : 'Aceptar'}</span>
        </Button>
        <Button
          onClick={() => setShowRejectDialog(true)}
          disabled={isAccepting || isRejecting}
          size="sm"
          className="flex-1 text-xs min-h-[36px] h-9 px-2 md:px-3 min-w-0 max-w-none md:min-w-[100px] bg-red-500 hover:bg-red-600 text-white border-0 flex items-center justify-center"
        >
          <X className="h-3 w-3 mr-1 md:mr-1.5 flex-shrink-0" />
          <span className="whitespace-nowrap">Rechazar</span>
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
