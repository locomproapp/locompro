
import React from 'react';
import { Calendar, MapPin, Truck, User } from 'lucide-react';
import ContactInfo from './ContactInfo';
import PriceHistory from './PriceHistory';

interface OfferContentProps {
  offer: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    price_history?: Array<{
      price: number;
      timestamp: string;
      type: 'rejected' | 'initial';
    }> | null;
    images: string[] | null;
    contact_info: any;
    delivery_time: string | null;
    created_at: string;
    profiles?: {
      full_name: string | null;
      email: string | null;
    } | null;
  };
}

const OfferContent = ({ offer }: OfferContentProps) => {
  return (
    <div className="space-y-4">
      {/* Images */}
      {offer.images && offer.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {offer.images.slice(0, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${offer.title} ${index + 1}`}
              className="w-full h-20 object-cover rounded border"
            />
          ))}
          {offer.images.length > 3 && (
            <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
              <span className="text-xs text-gray-500">
                +{offer.images.length - 3} más
              </span>
            </div>
          )}
        </div>
      )}

      {/* Description with fixed height for 3 lines */}
      <div className="h-[3.6rem] flex flex-col justify-start">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {offer.description || 'Sin descripción proporcionada'}
        </p>
      </div>

      {/* Price and delivery info */}
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">
          ${offer.price.toLocaleString('es-AR')}
        </div>
        {offer.delivery_time && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span className="text-sm">{offer.delivery_time}</span>
          </div>
        )}
      </div>

      {/* Price history */}
      <PriceHistory 
        currentPrice={offer.price}
        priceHistory={offer.price_history} 
      />

      {/* Contact info */}
      <ContactInfo contactInfo={offer.contact_info} />
    </div>
  );
};

export default OfferContent;
