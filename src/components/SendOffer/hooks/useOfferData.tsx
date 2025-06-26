
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SendOfferFormData } from '../SendOfferForm';

export const useOfferData = (editOfferId: string | null) => {
  const { user } = useAuth();
  const [isCounterOffer, setIsCounterOffer] = useState(false);
  const [actualBuyRequestId, setActualBuyRequestId] = useState<string | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<Partial<SendOfferFormData>>({});

  useEffect(() => {
    const loadOfferData = async () => {
      if (!editOfferId || !user) return;

      try {
        console.log('🔍 Loading offer data for edit:', editOfferId);
        
        const { data: offer, error } = await supabase
          .from('offers')
          .select('*')
          .eq('id', editOfferId)
          .eq('seller_id', user.id)
          .single();

        if (error) {
          console.error('Error loading offer:', error);
          return;
        }

        if (offer) {
          console.log('🔍 Loaded offer data:', offer);
          setIsCounterOffer(offer.status === 'rejected');
          setActualBuyRequestId(offer.buy_request_id);
          
          // Type-safe access to contact_info properties
          const contactInfo = offer.contact_info as { zone?: string; condition?: string } | null;
          
          const formValues: Partial<SendOfferFormData> = {
            title: offer.title,
            description: offer.description || '',
            price: offer.price,
            zone: contactInfo?.zone || '',
            condition: contactInfo?.condition || '',
            delivery_time: offer.delivery_time || '',
            images: offer.images || [],
          };
          
          setInitialFormValues(formValues);
        }
      } catch (error) {
        console.error('Error loading offer data:', error);
      }
    };

    loadOfferData();
  }, [editOfferId, user]);

  return {
    isCounterOffer,
    actualBuyRequestId,
    initialFormValues
  };
};
