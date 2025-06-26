
import React from 'react';
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

interface AcceptOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const AcceptOfferDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  isLoading 
}: AcceptOfferDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Confirmar aceptación?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es irreversible. Una vez que aceptes esta oferta:
            <br />
            <br />
            • Se descartarán permanentemente todas las demás ofertas
            <br />
            • No podrás cambiar de opinión después
            <br />
            • Se iniciará un chat directo con el vendedor
            <br />
            <br />
            ¿Estás seguro de que quieres aceptar esta oferta?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Aceptando...' : 'Sí, aceptar oferta'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AcceptOfferDialog;
