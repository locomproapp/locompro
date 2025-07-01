
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
    <div className="flex gap-3 w-full">
      <Button
        onClick={onAccept}
        disabled={isAccepting || isRejecting}
        className="flex-1 h-11"
      >
        <Check className="h-4 w-4 mr-2" />
        {isAccepting ? 'Aceptando...' : 'Aceptar'}
      </Button>
      <Button
        variant="destructive"
        onClick={onReject}
        disabled={isAccepting || isRejecting}  
        className="flex-1 h-11"
      >
        <X className="h-4 w-4 mr-2" />
        Rechazar
      </Button>
    </div>
  );
};

export default OfferActions;
