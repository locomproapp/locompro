
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RejectionReasonProps {
  rejectionReason: string;
}

const RejectionReason = ({ rejectionReason }: RejectionReasonProps) => {
  return (
    <div className="bg-red-100 border border-red-200 p-3 rounded-lg">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800">Motivo del rechazo:</p>
          <p className="text-sm text-red-700">{rejectionReason}</p>
        </div>
      </div>
    </div>
  );
};

export default RejectionReason;
