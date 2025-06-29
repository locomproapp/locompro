
import React from 'react';
import CompactOfferActions from './CompactOfferActions';
import CompactOfferOwnerActions from './CompactOfferOwnerActions';

interface CompactOfferActionSectionProps {
  canAcceptOrReject: boolean;
  isOfferOwner: boolean;
  offerId: string;
  buyRequestId: string;
  status: string;
  onStatusUpdate?: () => void;
}

const CompactOfferActionSection = ({
  canAcceptOrReject,
  isOfferOwner,
  offerId,
  buyRequestId,
  status,
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
      {isOfferOwner && (
        <CompactOfferOwnerActions
          offerId={offerId}
          buyRequestId={buyRequestId}
          status={status}
          isOfferOwner={isOfferOwner}
          onStatusUpdate={onStatusUpdate}
        />
      )}
    </div>
  );
};

export default CompactOfferActionSection;
