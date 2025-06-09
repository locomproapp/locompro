
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RejectOfferDialog from '@/components/RejectOfferDialog';

interface OfferActionsProps {
  offerId: string;
  status: string;
  showActions?: boolean;
  onStatusUpdate?: () => void;
}

const OfferActions = ({ offerId, status, showActions, onStatusUpdate }: OfferActionsProps) => {
  const { toast } = useToast();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const acceptOffer = async () => {
    try {
      setIsUpdating(true);
      console.log('ENHANCED ACCEPT: Starting accept process for offer:', offerId);
      
      const { data: updateData, error } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId)
        .select();

      if (error) {
        console.error('ENHANCED ACCEPT: Database error:', error);
        throw error;
      }

      console.log('ENHANCED ACCEPT: Database update successful:', updateData);

      toast({
        title: 'Oferta aceptada',
        description: 'La oferta ha sido aceptada exitosamente',
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
          onClick={acceptOffer}
          className="flex-1"
          size="sm"
          disabled={isUpdating}
        >
          <Check className="h-4 w-4 mr-1" />
          {isUpdating ? 'Aceptando...' : 'Aceptar'}
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
