import React from 'react';
import { useOffers } from '@/hooks/useOffers';
import CompactOfferCard from './OfferCard/CompactOfferCard';
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
  const {
    user
  } = useAuth();
  const {
    offers,
    loading,
    refetch
  } = useOffers(buyRequestId);
  console.log('🔍 OffersForRequest - buyRequestId:', buyRequestId);
  console.log('🔍 OffersForRequest - buyRequestOwnerId:', buyRequestOwnerId);
  console.log('🔍 OffersForRequest - offers:', offers);
  console.log('🔍 OffersForRequest - offers length:', offers?.length);
  console.log('🔍 OffersForRequest - loading:', loading);
  console.log('🔍 OffersForRequest - user:', user);
  const handleOfferUpdate = () => {
    console.log('🔄 OffersForRequest - Refreshing offers');
    refetch();
    onOfferUpdate?.();
  };
  if (loading) {
    console.log('⏳ OffersForRequest - Loading state');
    return <div className="text-center py-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Package className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-sm">Cargando ofertas...</p>
      </div>;
  }
  if (!offers || offers.length === 0) {
    console.log('📭 OffersForRequest - No offers to display');
    return <div className="text-center py-8">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <p className="text-muted-foreground text-sm">Aún no hay ofertas</p>
      </div>;
  }
  console.log('✅ OffersForRequest - Rendering', offers.length, 'offers');
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-xl">
          Ofertas Recibidas ({offers.length})
        </h3>
        
      </div>
      
      {/* Horizontal scrollable container for offers */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {offers.map(offer => {
        console.log('🎯 OffersForRequest - Rendering offer:', offer.id, offer.title);
        return <CompactOfferCard key={offer.id} offer={offer} buyRequestOwnerId={buyRequestOwnerId} onStatusUpdate={handleOfferUpdate} />;
      })}
      </div>
      
      {offers.length > 3 && <p className="text-xs text-muted-foreground text-center">
          Desplázate horizontalmente para ver más ofertas
        </p>}
    </div>;
};
export default OffersForRequest;