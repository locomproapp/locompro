
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OfferActionsProps {
  offerId: string;
  status: string;
  showActions?: boolean;
  onStatusUpdate?: () => void;
}

const OfferActions = ({ offerId, status, showActions, onStatusUpdate }: OfferActionsProps) => {
  const { toast } = useToast();

  const updateOfferStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: 'Estado actualizado',
        description: `La oferta ha sido ${newStatus === 'accepted' ? 'aceptada' : 'rechazada'}`,
      });

      onStatusUpdate?.();
    } catch (err) {
      console.error('Error updating offer status:', err);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la oferta',
        variant: 'destructive',
      });
    }
  };

  if (!showActions || status !== 'pending') {
    return null;
  }

  return (
    <div className="flex gap-2 pt-2">
      <Button
        onClick={() => updateOfferStatus('accepted')}
        className="flex-1"
        size="sm"
      >
        <Check className="h-4 w-4 mr-1" />
        Aceptar
      </Button>
      <Button
        onClick={() => updateOfferStatus('rejected')}
        variant="outline"
        className="flex-1"
        size="sm"
      >
        <X className="h-4 w-4 mr-1" />
        Rechazar
      </Button>
    </div>
  );
};

export default OfferActions;
