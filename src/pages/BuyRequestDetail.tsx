import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BuyRequestOffersList from '@/components/BuyRequestOffersList';
import { useBuyRequestDetail } from '@/hooks/useBuyRequestDetail';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BuyRequestInformation from '@/components/BuyRequestDetail/BuyRequestInformation';
import PublisherCard from '@/components/BuyRequestDetail/PublisherCard';
import ImageAndActionsCard from '@/components/BuyRequestDetail/ImageAndActionsCard';
import { OfferSubmissionModal } from '@/components/OfferSubmission';
import OffersForRequest from '@/components/OffersForRequest';

interface BuyRequestDetailType {
  id: string;
  title: string;
  description: string | null;
  min_price: number;
  max_price: number;
  zone: string;
  condition: string;
  reference_url: string | null;
  status: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
  } | null;
}

const BuyRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: buyRequestData, isLoading, error, refetch } = useBuyRequestDetail(id || '');

  const handleOfferSubmitted = () => {
    console.log('🔄 Offer submitted, refreshing data...');
    // Force a complete refresh of the page data
    if (refetch) {
      refetch();
    }
    // Small delay to ensure database changes are propagated
    setTimeout(() => {
      if (refetch) {
        refetch();
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando solicitud...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !buyRequestData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Solicitud no encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              La solicitud que buscas no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link to="/marketplace">Volver al marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const buyRequest: BuyRequestDetailType = {
    id: buyRequestData.id,
    title: buyRequestData.title,
    description: buyRequestData.description,
    min_price: buyRequestData.min_price,
    max_price: buyRequestData.max_price,
    zone: buyRequestData.zone,
    condition: buyRequestData.condition,
    reference_url: buyRequestData.reference_url,
    status: buyRequestData.status,
    created_at: buyRequestData.created_at,
    user_id: buyRequestData.user_id,
    profiles: buyRequestData.profiles
  };

  const isOwner = user?.id === buyRequest.user_id;
  const isActive = buyRequest.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 py-8 flex flex-col gap-8">
        {/* Desktop back button - only show on desktop */}
        <Button variant="ghost" asChild className="mb-4 self-start hidden md:flex">
          <Link to="/marketplace" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al mercado
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-6">
            <BuyRequestInformation buyRequest={buyRequest} buyRequestData={buyRequestData} />
            {/* Remove the PublisherCard on mobile, keep on desktop */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm hidden md:block">
              <PublisherCard buyRequest={buyRequest} />
            </div>
          </div>
          
          {/* Desktop image gallery - hidden on mobile */}
          <div className="hidden md:block">
            <ImageAndActionsCard
              buyRequest={buyRequestData}
              user={user}
              onUpdate={() => refetch()}
            />
          </div>
        </div>

        {!isOwner && isActive && (
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <OfferSubmissionModal 
              buyRequestId={buyRequest.id}
              buyRequestTitle={buyRequest.title}
              onOfferSubmitted={handleOfferSubmitted}
            />
          </div>
        )}

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <OffersForRequest 
            buyRequestId={buyRequest.id}
            buyRequestOwnerId={buyRequest.user_id}
            onOfferUpdate={handleOfferSubmitted}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyRequestDetail;
