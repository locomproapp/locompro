
import React, { useState, useMemo, useRef } from 'react';
import { useOffers } from '@/hooks/useOffers';
import CompactOfferCard from './OfferCard/CompactOfferCard';
import OffersTable from './OffersTable';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface OffersForRequestProps {
  buyRequestId: string;
  buyRequestOwnerId?: string;
  onOfferUpdate?: () => void;
}

const OffersForRequest = ({
  buyRequestId,
  buyRequestOwnerId,
  onOfferUpdate
}: OffersForRequestProps) => {
  const { user } = useAuth();
  const { offers, loading, refetch } = useOffers(buyRequestId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  console.log('🔍 OffersForRequest - buyRequestId:', buyRequestId);
  console.log('🔍 OffersForRequest - buyRequestOwnerId:', buyRequestOwnerId);
  console.log('🔍 OffersForRequest - offers:', offers);
  console.log('🔍 OffersForRequest - offers length:', offers?.length);
  console.log('🔍 OffersForRequest - loading:', loading);
  console.log('🔍 OffersForRequest - user:', user);

  // Sort offers by created_at descending (most recent first)
  const sortedOffers = useMemo(() => {
    if (!offers) return [];
    return [...offers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [offers]);

  const handleOfferUpdate = () => {
    console.log('🔄 OffersForRequest - Refreshing offers');
    refetch();
    onOfferUpdate?.();
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // 320px (w-80) + gap
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // 320px (w-80) + gap
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  if (loading) {
    console.log('⏳ OffersForRequest - Loading state');
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Package className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-sm">Cargando ofertas...</p>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    console.log('📭 OffersForRequest - No offers to display');
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <p className="text-muted-foreground text-sm">Aún no hay ofertas</p>
      </div>
    );
  }

  console.log('✅ OffersForRequest - Rendering', sortedOffers.length, 'offers');

  return (
    <div className="space-y-8">
      {/* Horizontal scrollable cards section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xl">
            Ofertas Recibidas ({sortedOffers.length})
          </h3>
          {sortedOffers.length > 3 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollRight}
                disabled={!canScrollRight}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={checkScrollButtons}
            onLoad={checkScrollButtons}
          >
            {sortedOffers.map(offer => {
              console.log('🎯 OffersForRequest - Rendering offer:', offer.id, offer.title);
              return (
                <CompactOfferCard 
                  key={offer.id} 
                  offer={offer} 
                  buyRequestOwnerId={buyRequestOwnerId} 
                  onStatusUpdate={handleOfferUpdate} 
                />
              );
            })}
          </div>
        </div>
        
        {sortedOffers.length > 3 && (
          <p className="text-xs text-muted-foreground text-center">
            Desplázate horizontalmente para ver más ofertas
          </p>
        )}
      </div>

      {/* Table section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-xl">Tabla de Ofertas</h3>
        <OffersTable 
          offers={sortedOffers} 
          buyRequestOwnerId={buyRequestOwnerId}
          onOfferUpdate={handleOfferUpdate}
        />
      </div>
    </div>
  );
};

export default OffersForRequest;
