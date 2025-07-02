
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
      console.log('ENHANCED ACCEPT: Starting accept process for offer:', offerId);
      
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
        console.error('ENHANCED ACCEPT: Error fetching offer data:', offerError);
        throw offerError;
      }

      console.log('ENHANCED ACCEPT: Offer data:', offerData);

      // Update the accepted offer status
      const { data: updateData, error: updateError } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId)
        .select();

      if (updateError) {
        console.error('ENHANCED ACCEPT: Database error:', updateError);
        throw updateError;
      }

      console.log('ENHANCED ACCEPT: Database update successful:', updateData);

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
        console.error('ENHANCED ACCEPT: Error finalizing other offers:', finalizeError);
        throw finalizeError;
      }

      // Create or get chat between buyer and seller
      const buyerId = offerData.buy_requests.user_id;
      const sellerId = offerData.seller_id;

      console.log('ENHANCED ACCEPT: Creating chat between buyer:', buyerId, 'and seller:', sellerId);

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
          console.error('ENHANCED ACCEPT: Error creating chat:', chatError);
          throw chatError;
        }

        console.log('ENHANCED ACCEPT: Chat created successfully');
      } else {
        console.log('ENHANCED ACCEPT: Chat already exists');
      }

      toast({
        title: 'Oferta aceptada',
        description: 'La oferta ha sido aceptada exitosamente. Se ha creado un chat para coordinar la transacción.',
      });

      // Force immediate callback
      if (onStatusUpdate) {
        console.log('ENHANCED ACCEPT: Triggering status update callback');
        setTimeout(onStatusUpdate, 100);
      }

      // Dispatch global event
      console.log('ENHANCED ACCEPT: Dispatching global event');
      window.dispatchEvent(new CustomEvent('offerStatusChanged', { 
        detail: { offerId, newStatus: 'accepted' } 
      }));

      // Close the dialog
      setShowAcceptDialog(false);

    } catch (err) {
      console.error('ENHANCED ACCEPT: Error accepting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo aceptar la oferta',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const rejectOffer = async (rejectionReason: string) => {
    try {
      setIsUpdating(true);
      console.log('ENHANCED REJECT: Starting rejection process for offer:', offerId);
      console.log('ENHANCED REJECT: Rejection reason:', rejectionReason);
      console.log('ENHANCED REJECT: Current user:', await supabase.auth.getUser());
      
      // First, verify we can read the offer
      const { data: offerCheck, error: checkError } = await supabase
        .from('offers')
        .select('id, status, buy_request_id, seller_id')
        .eq('id', offerId)
        .single();

      if (checkError) {
        console.error('ENHANCED REJECT: Error checking offer:', checkError);
        throw new Error(`No se pudo verificar la oferta: ${checkError.message}`);
      }

      console.log('ENHANCED REJECT: Offer data before update:', offerCheck);

      // Verify buy_request ownership
      const { data: buyRequestCheck, error: buyRequestError } = await supabase
        .from('buy_requests')
        .select('id, user_id')
        .eq('id', offerCheck.buy_request_id)
        .single();

      if (buyRequestError) {
        console.error('ENHANCED REJECT: Error checking buy request:', buyRequestError);
        throw new Error(`No se pudo verificar el buy request: ${buyRequestError.message}`);
      }

      console.log('ENHANCED REJECT: Buy request data:', buyRequestCheck);

      // Perform the update with detailed error handling
      const { data: updateData, error: updateError } = await supabase
        .from('offers')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId)
        .select();

      if (updateError) {
        console.error('ENHANCED REJECT: Database update error:', updateError);
        console.error('ENHANCED REJECT: Error details:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
        throw new Error(`Error de base de datos: ${updateError.message}`);
      }

      console.log('ENHANCED REJECT: Database update successful:', updateData);
      
      // Verify the update actually happened
      const { data: verifyData, error: verifyError } = await supabase
        .from('offers')
        .select('id, status, rejection_reason, updated_at')
        .eq('id', offerId)
        .single();

      if (verifyError) {
        console.error('ENHANCED REJECT: Error verifying update:', verifyError);
      } else {
        console.log('ENHANCED REJECT: Verified update result:', verifyData);
        if (verifyData.status !== 'rejected') {
          console.error('ENHANCED REJECT: WARNING - Status was not updated to rejected!', verifyData);
          throw new Error('La actualización no se aplicó correctamente');
        }
      }

      console.log('ENHANCED REJECT: Rejection successful, triggering updates');

      toast({
        title: 'Oferta rechazada',
        description: 'La oferta ha sido rechazada',
      });

      // Force immediate callback with multiple attempts
      if (onStatusUpdate) {
        console.log('ENHANCED REJECT: Triggering status update callbacks');
        setTimeout(onStatusUpdate, 100);
        setTimeout(onStatusUpdate, 500);
        setTimeout(onStatusUpdate, 1000);
      }

      // Force a page-wide event to notify all components
      console.log('ENHANCED REJECT: Dispatching global event');
      window.dispatchEvent(new CustomEvent('offerStatusChanged', { 
        detail: { offerId, newStatus: 'rejected', rejectionReason } 
      }));

    } catch (err) {
      console.error('ENHANCED REJECT: Complete error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al rechazar la oferta';
      toast({
        title: 'Error',
        description: errorMessage,
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
          Aceptar
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
