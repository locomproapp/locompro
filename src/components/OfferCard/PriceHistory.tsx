import React from 'react';
import { Calendar } from 'lucide-react';

interface PriceHistoryItem {
  price: number;
  timestamp: string;
  type: 'rejected' | 'initial';
}

interface PriceHistoryProps {
  currentPrice: number;
  priceHistory?: PriceHistoryItem[];
}

const PriceHistory = ({ currentPrice, priceHistory }: PriceHistoryProps) => {
  const format = (p: number) => '$' + p.toLocaleString('es-AR');

  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="text-xl font-bold text-primary">{format(currentPrice)}</div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-1">
      <div className="text-xl font-bold text-blue-600">{format(currentPrice)}</div>
      <div className="text-xs text-muted-foreground">Nueva oferta</div>
      
      {priceHistory.map((item, index) => (
        <div key={index} className="text-sm space-y-1">
          <div className="line-through text-muted-foreground">{format(item.price)}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Rechazada el {formatDate(item.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriceHistory;
