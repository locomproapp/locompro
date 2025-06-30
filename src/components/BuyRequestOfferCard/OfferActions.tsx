
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface OfferActionsProps {
  canAcceptOrReject: boolean;
  isAccepting: boolean;
  isRejecting: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const OfferActions = ({ 
  canAcceptOrReject, 
  isAccepting, 
  isRejecting, 
  onAccept, 
  onReject 
}: OfferActionsProps) => {
  if (!canAcceptOrReject) return null;

  return (
    <div className="flex gap-2 w-full">
      <Button
        onClick={onAccept}
        disabled={isAccepting || isRejecting}
        className="flex-1 text-xs md:text-sm"
        size="sm"
      >
        <Check className="h-3 w-3 mr-1" />
        {isAccepting ? 'Aceptando...' : 'Aceptar'}
      </Button>
      <Button
        variant="destructive"
        onClick={onReject}
        disabled={isAccepting || isRejecting}
        className="flex-1 text-xs md:text-sm"
        size="sm"
      >
        <X className="h-3 w-3 mr-1" />
        Rechazar
      </Button>
    </div>
  );
};

export default OfferActions;
