
import React from 'react';

interface RejectionReasonProps {
  status: string;
  rejectionReason: string | null;
}

const RejectionReason = ({ status, rejectionReason }: RejectionReasonProps) => {
  if (status !== 'rejected' || !rejectionReason) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded p-3">
      <p className="text-sm font-medium text-red-800">Motivo del rechazo:</p>
      <p className="text-sm text-red-700 mt-1">{rejectionReason}</p>
    </div>
  );
};

export default RejectionReason;
