
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
  if (!canAcceptOrReject) {
    return null;
  }

  return (
    <CompactOfferActions
      offerId={offerId}
      canAcceptOrReject={canAcceptOrReject}
      onStatusUpdate={onStatusUpdate}
    />
  );
};

export default CompactOfferActionSection;
