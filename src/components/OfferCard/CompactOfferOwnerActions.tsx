
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

  return (
    <div className="px-4 pb-4">
      {/* For pending offers: show Edit and Delete buttons */}
      {status === 'pending' && (
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                className="flex-1 text-xs text-destructive hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
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
        </div>
      )}

      {/* For rejected offers: show Delete and Counteroffer buttons */}
      {status === 'rejected' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  className="flex-1 text-xs text-destructive hover:text-destructive hover:border-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
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
          </div>
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

      {/* For accepted offers: show Delete button only */}
      {status === 'accepted' && (
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                className="flex-1 text-xs text-destructive hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
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
        </div>
      )}
    </div>
  );
};

export default CompactOfferOwnerActions;
