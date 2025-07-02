
import React from 'react';
import CompactOfferActions from './CompactOfferActions';

interface CompactOfferActionSectionProps {
  canAcceptOrReject: boolean;
  offerId: string;
  onStatusUpdate?: () => void;
}

const CompactOfferActionSection = ({
  canAcceptOrReject,
  offerId,
  onStatusUpdate
}: CompactOfferActionSectionProps) => {
  return (
    <div>
      {canAcceptOrReject && (
        <CompactOfferActions
          offerId={offerId}
          canAcceptOrReject={canAcceptOrReject}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </div>
  );
};

export default CompactOfferActionSection;
