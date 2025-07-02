
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RejectOfferDialog from '@/components/RejectOfferDialog';
import AcceptOfferDialog from '@/components/AcceptOfferDialog';

interface OfferActionsProps {
  offerId: string;
  status: string;
  showActions?: boolean;
  onStatusUpdate?: () => void;
}

const OfferActions = ({ offerId, status, showActions, onStatusUpdate }: OfferActionsProps) => {
  const { toast } = useToast();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const acceptOffer = async () => {
    try {
      setIsUpdating(true);
      console.log('Starting accept process for offer:', offerId);
      
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
        console.error('Error fetching offer data:', offerError);
        throw offerError;
      }

      console.log('Offer data fetched:', offerData);

      // Update the accepted offer status
      const { error: updateError } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (updateError) {
        console.error('Error updating offer status:', updateError);
        throw updateError;
      }

      console.log('Offer status updated to accepted');

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
        console.error('Error finalizing other offers:', finalizeError);
        throw finalizeError;
      }

      console.log('Other offers finalized');

      // Create or get chat between buyer and seller
      const buyerId = offerData.buy_requests.user_id;
      const sellerId = offerData.seller_id;

      console.log('Creating chat between buyer:', buyerId, 'and seller:', sellerId);

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
          console.error('Error creating chat:', chatError);
          throw chatError;
        }

        console.log('Chat created successfully');
      } else {
        console.log('Chat already exists');
      }

      toast({
        title: '¡Oferta aceptada!',
        description: 'La oferta ha sido aceptada exitosamente. Se ha creado un chat para coordinar la transacción.',
      });

      // Close the dialog first
      setShowAcceptDialog(false);

      // Trigger multiple update callbacks to ensure UI refresh
      if (onStatusUpdate) {
        console.log('Triggering status update callback');
        onStatusUpdate();
        // Add a slight delay and trigger again to ensure real-time updates
        setTimeout(() => {
          onStatusUpdate();
        }, 500);
      }

      // Force a complete page refresh to ensure all offers show the correct status
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      console.error('Error accepting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo aceptar la oferta. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const rejectOffer = async (rejectionReason: string) => {
    try {
      setIsUpdating(true);
      console.log('Starting rejection process for offer:', offerId);
      
      const { error: updateError } = await supabase
        .from('offers')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (updateError) {
        console.error('Error rejecting offer:', updateError);
        throw updateError;
      }

      console.log('Offer rejected successfully');

      toast({
        title: 'Oferta rechazada',
        description: 'La oferta ha sido rechazada exitosamente.',
      });

      // Trigger update callbacks
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
        description: 'No se pudo rechazar la oferta. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!showActions || status !== 'pending') {
    return null;
  }

  return (
    <>
      <div className="flex gap-2 pt-2">
        <Button
          onClick={() => setShowAcceptDialog(true)}
          className="flex-1"
          size="sm"
          disabled={isUpdating}
        >
          <Check className="h-4 w-4 mr-1" />
          {isUpdating ? 'Procesando...' : 'Aceptar'}
        </Button>
        <Button
          onClick={() => setShowRejectDialog(true)}
          variant="outline"
          className="flex-1"
          size="sm"
          disabled={isUpdating}
        >
          <X className="h-4 w-4 mr-1" />
          Rechazar
        </Button>
      </div>

      <AcceptOfferDialog
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onConfirm={acceptOffer}
        isLoading={isUpdating}
      />

      <RejectOfferDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={rejectOffer}
        isLoading={isUpdating}
      />
    </>
  );
};

export default OfferActions;
