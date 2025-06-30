
import React from 'react';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from './utils';

interface OfferContentProps {
  title: string;
  description: string | null;
  price: number;
  zone: string;
  images: string[] | null;
  characteristics: any;
}

const OfferContent = ({ title, description, price, zone, images, characteristics }: OfferContentProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
        {/* Description with fixed height for 3 lines - responsive */}
        <div className="h-[4.2rem] sm:h-[3.6rem] flex flex-col justify-start">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {description || 'Sin descripción proporcionada'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-primary">
          ${formatPrice(price)}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{zone}</span>
        </div>
      </div>

      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.slice(0, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} ${index + 1}`}
              className="w-full h-20 object-cover rounded border"
            />
          ))}
          {images.length > 3 && (
            <div className="w-full h-20 bg-muted rounded border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">
                +{images.length - 3} más
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-20 bg-muted rounded border flex items-center justify-center">
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {characteristics && (
        <div className="text-sm">
          <strong>Características:</strong>
          <pre className="mt-1 text-muted-foreground whitespace-pre-wrap">
            {JSON.stringify(characteristics, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OfferContent;
