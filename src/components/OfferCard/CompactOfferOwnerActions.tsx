
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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

  // Don't show any actions for accepted offers (no delete button)
  if (status === 'accepted') {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3 w-full px-0 md:px-1 box-border">
      {/* For pending and rejected offers: show consistent button layout */}
      {(status === 'pending' || status === 'rejected') && (
        <>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 text-xs md:text-xs min-h-[36px] h-9 px-2 md:px-3 min-w-0 max-w-none md:min-w-[100px] md:max-w-[140px] flex items-center justify-center"
          >
            <Link to={`/send-offer/${buyRequestId}?edit=${offerId}`}>
              {status === 'pending' ? (
                <>
                  <Edit className="h-3 w-3 mr-1 md:mr-1.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Editar</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 md:mr-1.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">Contraofertar</span>
                </>
              )}
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                className="flex-1 text-xs md:text-xs min-h-[36px] h-9 px-2 md:px-3 min-w-0 max-w-none md:min-w-[100px] md:max-w-[140px] text-destructive hover:text-destructive hover:border-destructive flex items-center justify-center"
              >
                <Trash2 className="h-3 w-3 mr-1 md:mr-1.5 flex-shrink-0" />
                <span className="whitespace-nowrap">{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente tu oferta. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteOffer}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* For finalized offers: show Delete button only */}
      {status === 'finalized' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              className="w-full max-w-[200px] text-xs min-h-[36px] h-9 px-3 text-destructive hover:text-destructive hover:border-destructive flex items-center justify-center"
            >
              <Trash2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente tu oferta. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteOffer}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default CompactOfferOwnerActions;
