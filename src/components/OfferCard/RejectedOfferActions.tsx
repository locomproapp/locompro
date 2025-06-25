
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
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
      <Button
        asChild
        variant="outline"
        size="sm"
        className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Link to={`/send-offer/${buyRequestId}?edit=${offerId}`}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Contraofertar
        </Link>
      </Button>
    </div>
  );
};

export default RejectedOfferActions;
