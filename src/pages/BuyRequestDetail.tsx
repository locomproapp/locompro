
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OfferForm from '@/components/OfferForm';
import CompareOffers from '@/components/CompareOffers';
import { useBuyRequestDetail } from '@/hooks/useBuyRequestDetail';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BuyRequestInformation from '@/components/BuyRequestDetail/BuyRequestInformation';
import PublisherCard from '@/components/BuyRequestDetail/PublisherCard';
import ImageAndActionsCard from '@/components/BuyRequestDetail/ImageAndActionsCard';

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

  useEffect(() => {
    if (id && refetch) {
      refetch();
    }
  }, [id, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <Button variant="ghost" asChild className="mb-4 self-start">
          <Link to="/marketplace" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al mercado
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            <BuyRequestInformation buyRequest={buyRequest} />
            <PublisherCard buyRequest={buyRequest} />
          </div>
          
          <ImageAndActionsCard
            buyRequest={buyRequest}
            user={user}
            onUpdate={() => refetch()}
          />
        </div>

        {!isOwner && isActive && (
          <div className="pt-8 border-t border-border mt-8">
            <OfferForm 
              buyRequestId={buyRequest.id}
              buyRequestTitle={buyRequest.title}
            />
          </div>
        )}

        <div className="border-t border-border pt-8 mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Ofertas Recibidas</h2>
          <CompareOffers buyRequestId={buyRequest.id} isOwner={isOwner} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyRequestDetail;
