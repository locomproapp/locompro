
import React from 'react';

interface CompactOfferRejectionReasonProps {
  status: string;
  rejectionReason: string | null;
}

const CompactOfferRejectionReason = ({ status, rejectionReason }: CompactOfferRejectionReasonProps) => {
  if (status !== 'rejected' || !rejectionReason) {
    return null;
  }

  return (
    <div className="px-4 pb-3">
      <div className="bg-red-50 border border-red-200 rounded p-2">
        <p className="text-xs font-medium text-red-800">Motivo del rechazo:</p>
        <p className="text-xs text-red-700 mt-1 line-clamp-2">{rejectionReason}</p>
      </div>
    </div>
  );
};

export default CompactOfferRejectionReason;
