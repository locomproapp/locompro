
import React, { useState, useMemo } from 'react';
import { useOffers } from '@/hooks/useOffers';
import CompactOfferCard from './OfferCard/CompactOfferCard';
import OffersTable from './OffersTable';
import { Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
  
  console.log('🔍 OffersForRequest - buyRequestId:', buyRequestId);
  console.log('🔍 OffersForRequest - buyRequestOwnerId:', buyRequestOwnerId);
  console.log('🔍 OffersForRequest - offers:', offers);
  console.log('🔍 OffersForRequest - offers length:', offers?.length);
  console.log('🔍 OffersForRequest - loading:', loading);
  console.log('🔍 OffersForRequest - user:', user);

  // Sort offers to prioritize accepted ones first
  const sortedOffers = useMemo(() => {
    if (!offers || offers.length === 0) return [];
    
    return [...offers].sort((a, b) => {
      // Status priority: accepted > pending > rejected > finalized
      const statusOrder = {
        'accepted': 1,
        'pending': 2,
        'rejected': 3,
        'finalized': 4
      };
      
      const aOrder = statusOrder[a.status as keyof typeof statusOrder] || 5;
      const bOrder = statusOrder[b.status as keyof typeof statusOrder] || 5;
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      // Within same status, sort by creation date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [offers]);

  const handleOfferUpdate = () => {
    console.log('🔄 OffersForRequest - Refreshing offers');
    refetch();
    onOfferUpdate?.();
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
        <p className="text-muted-foreground text-sm">Aún no hay ofertas para este producto</p>
        <p className="text-xs text-muted-foreground mt-2">Las ofertas van a aparecer acá cuando otros usuarios las envíen</p>
      </div>
    );
  }

  console.log('✅ OffersForRequest - Rendering', sortedOffers.length, 'offers for all users');

  return (
    <div className="space-y-8">
      {/* Horizontal scrollable cards section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xl">
            Ofertas Recibidas ({sortedOffers.length})
          </h3>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-4 px-4 md:px-0 -mx-4 md:mx-0" style={{
          scrollSnapType: 'x mandatory'
        }}>
          {sortedOffers.map(offer => {
            console.log('🎯 OffersForRequest - Rendering offer card:', offer.id, offer.title);
            return (
              <div key={offer.id} className="flex-shrink-0" style={{
                scrollSnapAlign: 'start'
              }}>
                <CompactOfferCard 
                  offer={offer} 
                  buyRequestOwnerId={buyRequestOwnerId} 
                  onStatusUpdate={handleOfferUpdate} 
                />
              </div>
            );
          })}
        </div>
        
        {sortedOffers.length > 3 && (
          <p className="text-xs text-muted-foreground text-center">
            Deslizá horizontalmente para ver todas las ofertas
          </p>
        )}
      </div>

      {/* Table section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-xl">Comparación de Ofertas</h3>
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
