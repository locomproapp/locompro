
import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import OfferStatus from './OfferStatus';
import PriceHistory from './PriceHistory';

interface OfferHeaderProps {
  title: string;
  price: number;
  priceHistory?: Array<{
    price: number;
    timestamp: string;
    type: 'rejected' | 'initial';
  }>;
  status: string;
  buyRequest?: {
    title: string;
    zone: string;
    status: string;
  } | null;
  profile?: {
    full_name: string | null;
    email: string | null;
  } | null;
  showPublicInfo?: boolean;
  buyerRating?: number | null;
  offerId?: string;
}

const OfferHeader = ({ 
  title, 
  price, 
  priceHistory,
  status, 
  buyRequest, 
  profile, 
  showPublicInfo, 
  buyerRating,
  offerId
}: OfferHeaderProps) => {
  const renderRating = (rating: number | null | undefined) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating}/5)</span>
      </div>
    );
  };

  const isRequestClosed = buyRequest?.status === 'closed';

  const TitleComponent = offerId ? (
    <Link 
      to={`/offer/${offerId}`}
      className="text-primary hover:underline"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
    </Link>
  ) : (
    <h3 className="font-semibold text-lg">{title}</h3>
  );

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        {TitleComponent}
        {buyRequest && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Para: {buyRequest.title} ({buyRequest.zone})
            </p>
            {isRequestClosed && (
              <p className="text-xs text-orange-600 font-medium">
                La solicitud de compra ha sido cerrada
              </p>
            )}
          </div>
        )}
        {showPublicInfo && profile?.full_name && (
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">
              Por: {profile.full_name}
            </p>
            {buyerRating && renderRating(buyerRating)}
          </div>
        )}
      </div>
      <div className="text-right">
        <PriceHistory currentPrice={price} priceHistory={priceHistory} />
        <OfferStatus status={status} />
      </div>
    </div>
  );
};

export default OfferHeader;
