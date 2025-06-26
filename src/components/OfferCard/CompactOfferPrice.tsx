
import React from 'react';

interface PriceHistoryItem {
  price: number;
  timestamp: string;
  type: 'rejected' | 'initial';
}

interface CompactOfferPriceProps {
  currentPrice: number;
  priceHistory?: PriceHistoryItem[] | null;
  status: string;
}

const CompactOfferPrice = ({ currentPrice, priceHistory, status }: CompactOfferPriceProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    }).replace(/,/g, '.');
  };

  // Only show crossed out price if there's actual price history (meaning there was a counteroffer)
  // and the current status is pending (meaning it's an active counteroffer)
  if (priceHistory && priceHistory.length > 0 && status === 'pending') {
    const lastHistoryPrice = priceHistory[priceHistory.length - 1].price;
    
    // Only show crossed out if the current price is different from the last history price
    if (currentPrice !== lastHistoryPrice) {
      return (
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground line-through">
            ${formatPrice(lastHistoryPrice)}
          </div>
          <div className="text-lg font-bold text-primary">
            ${formatPrice(currentPrice)}
          </div>
        </div>
      );
    }
  }

  // Default price display
  return (
    <div className="text-lg font-bold text-primary">
      ${formatPrice(currentPrice)}
    </div>
  );
};

export default CompactOfferPrice;
