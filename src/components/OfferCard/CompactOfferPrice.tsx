
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

  // If offer is rejected and has price history, show crossed out original price
  if (status === 'rejected' && priceHistory && priceHistory.length > 0) {
    const originalPrice = priceHistory[priceHistory.length - 1].price;
    
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground line-through">
          ${formatPrice(originalPrice)}
        </div>
        <div className="text-lg font-bold text-primary">
          ${formatPrice(currentPrice)}
        </div>
      </div>
    );
  }

  // Default price display
  return (
    <div className="text-lg font-bold text-primary">
      ${formatPrice(currentPrice)}
    </div>
  );
};

export default CompactOfferPrice;
