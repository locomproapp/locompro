
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
      console.log('Accepting offer:', offerId);
      
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: 'Oferta aceptada',
        description: 'La oferta ha sido aceptada exitosamente',
      });

      // Force immediate callback
      if (onStatusUpdate) {
        setTimeout(onStatusUpdate, 100);
      }
    } catch (err) {
      console.error('Error accepting offer:', err);
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
      console.log('Rejecting offer:', offerId, 'with reason:', rejectionReason);
      
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) throw error;

      console.log('Offer rejection successful, triggering updates');

      toast({
        title: 'Oferta rechazada',
        description: 'La oferta ha sido rechazada',
      });

      // Force immediate callback with multiple attempts
      if (onStatusUpdate) {
        setTimeout(onStatusUpdate, 100);
        setTimeout(onStatusUpdate, 500);
        setTimeout(onStatusUpdate, 1000);
      }

      // Force a page-wide event to notify all components
      window.dispatchEvent(new CustomEvent('offerStatusChanged', { 
        detail: { offerId, newStatus: 'rejected', rejectionReason } 
      }));

    } catch (err) {
      console.error('Error rejecting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo rechazar la oferta',
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
