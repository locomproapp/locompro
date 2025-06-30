
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface OwnerActionsProps {
  canAcceptOrReject: boolean;
  isAccepting: boolean;
  isRejecting: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const OwnerActions = ({ 
  canAcceptOrReject, 
  isAccepting, 
  isRejecting, 
  onAccept, 
  onReject 
}: OwnerActionsProps) => {
  if (!canAcceptOrReject) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
      <p className="text-sm font-medium text-blue-800 mb-3">Acciones del propietario:</p>
      <div className="flex gap-2">
        <Button
          onClick={onAccept}
          disabled={isAccepting || isRejecting}
          className="flex-1"
        >
          <Check className="h-4 w-4 mr-2" />
          {isAccepting ? 'Aceptando...' : 'Aceptar'}
        </Button>
        <Button
          variant="destructive"
          onClick={onReject}
          disabled={isAccepting || isRejecting}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Rechazar
        </Button>
      </div>
    </div>
  );
};

export default OwnerActions;
