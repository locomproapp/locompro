
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EditBuyRequestDialog from './EditBuyRequestDialog';

interface BuyRequestActionsProps {
  buyRequestId: string;
  buyRequestTitle: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onUpdate: () => void;
}

const BuyRequestActions = ({ buyRequestId, buyRequestTitle, onDelete, onUpdate }: BuyRequestActionsProps) => {
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await onDelete(buyRequestId);
      if (result.success) {
        toast({
          title: "Solicitud eliminada",
          description: "La solicitud ha sido eliminada exitosamente"
        });
        
        // Dispatch global event to update marketplace and other views
        window.dispatchEvent(new CustomEvent('buyRequestDeleted', { 
          detail: { buyRequestId } 
        }));
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo eliminar la solicitud",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditUpdate = () => {
    onUpdate();
    // Dispatch global event to update marketplace and other views
    window.dispatchEvent(new CustomEvent('buyRequestUpdated', { 
      detail: { buyRequestId } 
    }));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente la solicitud "{buyRequestTitle}" y todas las ofertas asociadas.
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
        </DropdownMenuContent>
      </DropdownMenu>

      <EditBuyRequestDialog
        buyRequestId={buyRequestId}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdate={handleEditUpdate}
      />
    </>
  );
};

export default BuyRequestActions;
