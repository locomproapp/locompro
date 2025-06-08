
import React, { useState } from 'react';
import { useOffers } from '@/hooks/useOffers';
import OfferCard from './OfferCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, SortAsc } from 'lucide-react';

interface PublicOffersListProps {
  buyRequestId: string;
}

const PublicOffersList = ({ buyRequestId }: PublicOffersListProps) => {
  const { offers, loading } = useOffers(buyRequestId);
  const [sortBy, setSortBy] = useState<'created_at' | 'price' | 'buyer_rating'>('created_at');

  const sortedOffers = [...offers].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'buyer_rating':
        // Sort by rating descending (highest first), then by created_at
        if (a.buyer_rating && b.buyer_rating) {
          return b.buyer_rating - a.buyer_rating;
        }
        if (a.buyer_rating && !b.buyer_rating) return -1;
        if (!a.buyer_rating && b.buyer_rating) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'created_at':
      default:
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-1">
            Ofertas Recibidas ({offers.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Todas las ofertas de vendedores para este producto
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value: 'created_at' | 'price' | 'buyer_rating') => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Orden de llegada</SelectItem>
              <SelectItem value="price">Precio (menor a mayor)</SelectItem>
              <SelectItem value="buyer_rating">Valoración</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedOffers.length > 0 ? (
        <div className="space-y-4">
          {sortedOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              showActions={false}
              showPublicInfo={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">
            Aún no hay ofertas
          </h4>
          <p className="text-muted-foreground">
            Sé el primero en enviar una oferta para este producto.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicOffersList;
