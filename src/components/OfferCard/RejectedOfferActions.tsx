
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RejectedOfferActionsProps {
  offerId: string;
  currentPrice: number;
  buyRequestId: string;
  onStatusUpdate?: () => void;
}

const RejectedOfferActions = ({ 
  offerId, 
  currentPrice, 
  buyRequestId,
  onStatusUpdate 
}: RejectedOfferActionsProps) => {
  return (
    <div className="pt-2 border-t">
      <div className="flex justify-center gap-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 max-w-[120px] text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Link to={`/send-offer/${buyRequestId}?edit=${offerId}`}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Contraofertar
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 max-w-[120px] text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default RejectedOfferActions;
