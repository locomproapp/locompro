
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, RefreshCw, Trash2 } from 'lucide-react';
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

interface RejectedOfferActionsProps {
  offerId: string;
  currentPrice: number;
  onStatusUpdate?: () => void;
}

const RejectedOfferActions = ({ offerId, currentPrice, onStatusUpdate }: RejectedOfferActionsProps) => {
  const { toast } = useToast();
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCounterOffer = async () => {
    if (!newPrice || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa un precio válido',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUpdating(true);
      console.log('Creating counteroffer for offer:', offerId, 'New price:', newPrice);

      // Try to get current offer data to preserve price history if column exists
      let priceHistory = null;
      try {
        const { data: currentOffer, error: fetchError } = await supabase
          .from('offers')
          .select('price, price_history')
          .eq('id', offerId)
          .single();

        if (fetchError) {
          // If price_history column doesn't exist, we'll just update without it
          console.log('Price history column may not exist yet, proceeding without it');
        } else if (currentOffer) {
          // Create price history array if the column exists
          priceHistory = currentOffer.price_history || [];
          priceHistory.push({
            price: currentOffer.price,
            timestamp: new Date().toISOString(),
            type: 'rejected'
          });
        }
      } catch (err) {
        console.log('Error fetching price history, proceeding without it:', err);
      }

      // Update offer with new price and status
      const updateData: any = { 
        price: Number(newPrice),
        status: 'pending',
        rejection_reason: null,
        updated_at: new Date().toISOString()
      };

      // Only add price_history if we successfully got it
      if (priceHistory !== null) {
        updateData.price_history = priceHistory;
      }

      const { error } = await supabase
        .from('offers')
        .update(updateData)
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: 'Contraoferta enviada',
        description: 'Tu nueva oferta ha sido enviada al comprador',
      });

      setShowCounterOffer(false);
      setNewPrice('');

      // Trigger updates
      if (onStatusUpdate) {
        setTimeout(onStatusUpdate, 100);
      }

      // Dispatch global event
      window.dispatchEvent(new CustomEvent('offerStatusChanged', { 
        detail: { offerId, newStatus: 'pending' } 
      }));

    } catch (err) {
      console.error('Error creating counteroffer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo enviar la contraoferta',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOffer = async () => {
    try {
      setIsDeleting(true);
      console.log('Deleting offer:', offerId);
      
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: 'Oferta eliminada',
        description: 'Tu oferta ha sido eliminada exitosamente',
      });

      // Trigger updates
      if (onStatusUpdate) {
        setTimeout(onStatusUpdate, 100);
      }

      // Dispatch global event
      window.dispatchEvent(new CustomEvent('offerStatusChanged', { 
        detail: { offerId, newStatus: 'deleted' } 
      }));

    } catch (err) {
      console.error('Error deleting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la oferta',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (showCounterOffer) {
    return (
      <div className="space-y-3 pt-2 border-t">
        <h4 className="font-medium text-sm">Hacer contraoferta</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Precio actual:</span>
            <span className="line-through text-muted-foreground">${currentPrice}</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Nuevo precio"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleCounterOffer}
              disabled={isUpdating}
              size="sm"
            >
              {isUpdating ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCounterOffer(false)}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 pt-2 border-t">
      <Button
        onClick={() => setShowCounterOffer(true)}
        variant="outline"
        size="sm"
        className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
        disabled={isUpdating || isDeleting}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Contraoferta
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            disabled={isUpdating || isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              ¿Eliminar oferta?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará tu oferta permanentemente. No podrás recuperarla ni seguir negociando en este buy request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOffer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar eliminación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RejectedOfferActions;
