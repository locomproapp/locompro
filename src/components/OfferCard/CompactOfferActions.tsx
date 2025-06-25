
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
      <div className="flex gap-2 mt-auto">
        <Button
          onClick={acceptOffer}
          disabled={isAccepting || isRejecting}
          size="sm"
          className="flex-1 text-xs"
        >
          <Check className="h-3 w-3 mr-1" />
          {isAccepting ? 'Aceptando...' : 'Aceptar'}
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowRejectDialog(true)}
          disabled={isAccepting || isRejecting}
          size="sm"
          className="flex-1 text-xs"
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
