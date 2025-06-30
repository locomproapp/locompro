
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface SellerActionsProps {
  offerId: string;
  isLoading?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SellerActions = ({ offerId, isLoading = false, onEdit, onDelete }: SellerActionsProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded p-3">
      <p className="text-sm font-medium text-red-800 mb-3">Acciones de tu oferta:</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={isLoading}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default SellerActions;
