
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
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-xl text-foreground mb-3">{title}</h3>
        {/* Full description display - no height restriction */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Descripción</h4>
          <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
            {description || 'Sin descripción proporcionada'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-3xl font-bold text-primary">
          ${formatPrice(price)}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5" />
          <span className="text-base">{zone}</span>
        </div>
      </div>

      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.slice(0, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
          ))}
          {images.length > 3 && (
            <div className="w-full h-24 bg-muted rounded-lg border flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                +{images.length - 3} más
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-24 bg-muted rounded-lg border flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      {characteristics && (
        <div className="text-base">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Características</h4>
          <pre className="text-foreground whitespace-pre-wrap font-sans">
            {JSON.stringify(characteristics, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OfferContent;
