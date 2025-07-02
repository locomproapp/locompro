
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface OfferOwnerActionsProps {
  offerId: string;
  offerTitle: string;
  buyRequestId: string;
  status: string;
  onUpdate?: () => void;
}

const OfferOwnerActions = ({ offerId, offerTitle, buyRequestId, status, onUpdate }: OfferOwnerActionsProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Oferta eliminada",
        description: "La oferta ha sido eliminada exitosamente"
      });

      if (onUpdate) {
        onUpdate();
      }

      // Dispatch global event to update other views
      window.dispatchEvent(new CustomEvent('offerDeleted', { 
        detail: { offerId } 
      }));
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la oferta",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 pt-2">
      {/* Edit button - only show for pending offers */}
      {status === 'pending' && (
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="flex-1"
        >
          <Link to={`/send-offer/${buyRequestId}?edit=${offerId}`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
      )}
      
      {/* Delete button - always visible */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-destructive hover:text-destructive hover:border-destructive"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la oferta "{offerTitle}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OfferOwnerActions;
