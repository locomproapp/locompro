
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface PendingOfferActionsProps {
  offerId: string;
  isOfferOwner: boolean;
  status: string;
}

const PendingOfferActions = ({ offerId, isOfferOwner, status }: PendingOfferActionsProps) => {
  // Only show for pending offers owned by the current user
  if (status !== 'pending' || !isOfferOwner) return null;

  const handleEdit = () => {
    console.log('Edit offer:', offerId);
    // TODO: Implement edit functionality
  };

  const handleDelete = () => {
    console.log('Delete offer:', offerId);
    // TODO: Implement delete functionality
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-blue-800">
          Esta es tu oferta - puedes editarla o eliminarla
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            className="text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="text-red-700 border-red-300 hover:bg-red-100"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingOfferActions;
