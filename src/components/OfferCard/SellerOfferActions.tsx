
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SellerOfferActionsProps {
  offerId: string;
  status: string;
  onStatusUpdate?: () => void;
}

const SellerOfferActions = ({ offerId, status, onStatusUpdate }: SellerOfferActionsProps) => {
  const { toast } = useToast();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const withdrawOffer = async () => {
    try {
      setIsWithdrawing(true);
      console.log('Withdrawing offer:', offerId);
      
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'withdrawn',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: 'Oferta retirada',
        description: 'Tu oferta ha sido retirada exitosamente',
      });

      // Trigger immediate updates
      if (onStatusUpdate) {
        setTimeout(onStatusUpdate, 100);
      }

      // Dispatch global event for real-time updates
      window.dispatchEvent(new CustomEvent('offerStatusChanged', { 
        detail: { offerId, newStatus: 'withdrawn' } 
      }));

    } catch (err) {
      console.error('Error withdrawing offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo retirar la oferta',
        variant: 'destructive',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Only show withdraw option for pending offers
  if (status !== 'pending') {
    return null;
  }

  return (
    <div className="pt-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 text-muted-foreground hover:text-destructive hover:border-destructive"
            disabled={isWithdrawing}
          >
            <X className="h-4 w-4" />
            {isWithdrawing ? 'Retirando...' : 'Retirar oferta'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              ¿Retirar oferta?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción retirará tu oferta permanentemente. El comprador no podrá aceptarla y no podrás deshacerlo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={withdrawOffer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar retiro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SellerOfferActions;
