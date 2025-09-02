
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OfferDetailHeader from '@/components/OfferDetail/OfferDetailHeader';
import OfferInformation from '@/components/OfferDetail/OfferInformation';
import OfferSidebar from '@/components/OfferDetail/OfferSidebar';
import OfferChat from '@/components/OfferDetail/OfferChat';
import OfferDetailLoading from '@/components/OfferDetail/OfferDetailLoading';
import OfferDetailError from '@/components/OfferDetail/OfferDetailError';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const OfferDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: offer, isLoading, error } = useQuery({
    queryKey: ['offer', id],
    queryFn: async () => {
      if (!id) throw new Error('Offer ID is required');
      
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          profiles (
            full_name,
            email,
            avatar_url
          ),
          buy_requests (
            title,
            zone,
            status,
            user_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return <OfferDetailLoading />;
  }

  if (error || !offer) {
    return <OfferDetailError />;
  }

  const isSeller = user?.id === offer.seller_id;
  const isBuyer = user?.id === offer.buy_requests?.user_id;
  const shouldShowChat = offer.status === 'accepted' && user && offer.buy_requests;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OfferDetailHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            <OfferInformation 
              offer={offer}
              isSeller={isSeller}
              isBuyer={isBuyer}
            />

            {shouldShowChat && (
              <OfferChat 
                offer={offer}
                isSeller={isSeller}
              />
            )}
          </div>

          {/* Columna lateral */}
          <OfferSidebar offer={offer} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OfferDetail;
