
import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface BuyRequestActionsProps {
  buyRequestId: string;
  buyRequestTitle: string;
  buyRequestUserId?: string;
  buyRequestStatus?: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onUpdate: () => void;
}

const BuyRequestActions = ({ 
  buyRequestId, 
  buyRequestTitle, 
  buyRequestUserId,
  buyRequestStatus = 'active',
  onDelete, 
  onUpdate 
}: BuyRequestActionsProps) => {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Only show actions if user is the owner of the buy request
  const isOwner = user?.id === buyRequestUserId;
  
  // Don't show actions if request is finalized
  const isFinalized = buyRequestStatus === 'finalized';

  if (!isOwner || isFinalized) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await onDelete(buyRequestId);
      
      if (result.success) {
        onUpdate();
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Error deleting buy request:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/edit-buy-request/${buyRequestId}`} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la solicitud "{buyRequestTitle}".
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
    </>
  );
};

export default BuyRequestActions;
