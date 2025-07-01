
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SellerActionsProps {
  offerId: string;
  buyRequestId: string;
  onUpdate: () => void;
}

const SellerActions = ({ offerId, buyRequestId, onUpdate }: SellerActionsProps) => {
  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-center gap-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 max-w-[140px] text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Link to={`/send-offer/${buyRequestId}?edit=${offerId}`}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Contraofertar
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 max-w-[140px] text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => {
            // TODO: Implement delete functionality
            console.log('Delete offer:', offerId);
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default SellerActions;
