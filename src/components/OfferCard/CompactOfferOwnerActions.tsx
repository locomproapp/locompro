
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface CompactOfferOwnerActionsProps {
  offerId: string;
  buyRequestId: string;
  status: string;
  isOfferOwner: boolean;
  onStatusUpdate?: () => void;
}

const CompactOfferOwnerActions = ({ 
  offerId, 
  buyRequestId, 
  status, 
  isOfferOwner, 
  onStatusUpdate 
}: CompactOfferOwnerActionsProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOffer = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: 'Oferta eliminada',
        description: 'La oferta ha sido eliminada exitosamente',
      });

      onStatusUpdate?.();
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

  if (!isOfferOwner) {
    return null;
  }

  return (
    <div className="px-4 pb-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="flex-1 text-xs"
        >
          <Link to={`/send-offer/${buyRequestId}?edit=${offerId}`}>
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteOffer}
          disabled={isDeleting}
          className="flex-1 text-xs text-destructive hover:text-destructive hover:border-destructive"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>

      {/* Counter-offer button only for rejected offers */}
      {status === 'rejected' && (
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Link to={`/send-offer/${buyRequestId}?edit=${offerId}`}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Contraofertar
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompactOfferOwnerActions;
