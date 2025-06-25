
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBuyRequestDetail } from '@/hooks/useBuyRequestDetail';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SendOfferFormData } from './SendOfferForm';

export const useSendOfferLogic = () => {
  const { id: buyRequestId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const editOfferId = searchParams.get('edit');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCounterOffer, setIsCounterOffer] = useState(false);
  const [actualBuyRequestId, setActualBuyRequestId] = useState<string | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<Partial<SendOfferFormData>>({});

  console.log('🔍 SendOffer - URL buyRequestId:', buyRequestId);
  console.log('🔍 SendOffer - editOfferId:', editOfferId);

  // Get the buy request data
  const { data: buyRequest, isLoading: buyRequestLoading } = useBuyRequestDetail(actualBuyRequestId || buyRequestId || '');

  // Load offer data if it's a counteroffer or edit
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
          
          const formValues: Partial<SendOfferFormData> = {
            title: offer.title,
            description: offer.description || '',
            price: offer.price,
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

  const handleSubmit = async (values: SendOfferFormData) => {
    const targetBuyRequestId = actualBuyRequestId || buyRequestId;
    
    if (!user || !targetBuyRequestId) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para enviar una oferta",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Enviando oferta con datos:', values);
      console.log('Target buy request ID:', targetBuyRequestId);

      if (isCounterOffer && editOfferId) {
        // Get current offer data to preserve price history
        const { data: currentOffer, error: fetchError } = await supabase
          .from('offers')
          .select('price, price_history')
          .eq('id', editOfferId)
          .single();

        if (fetchError) {
          console.error('Error fetching current offer:', fetchError);
          throw fetchError;
        }

        // Create price history array
        const existingHistory = currentOffer.price_history as Array<{
          price: number;
          timestamp: string;
          type: 'rejected' | 'initial';
        }> | null;
        
        const priceHistory = existingHistory || [];
        
        // Only add to history if price actually changed
        if (currentOffer.price !== values.price) {
          priceHistory.push({
            price: currentOffer.price,
            timestamp: new Date().toISOString(),
            type: 'rejected'
          });
        }

        // Update offer for counteroffer
        const { error } = await supabase
          .from('offers')
          .update({
            title: values.title,
            description: values.description || null,
            price: values.price,
            delivery_time: values.delivery_time,
            images: values.images.length > 0 ? values.images : null,
            status: 'pending',
            rejection_reason: null,
            price_history: priceHistory,
            updated_at: new Date().toISOString()
          })
          .eq('id', editOfferId);

        if (error) {
          console.error('Error actualizando oferta:', error);
          throw error;
        }

        toast({
          title: "¡Contraoferta enviada!",
          description: "Tu contraoferta ha sido enviada exitosamente"
        });
      } else if (editOfferId) {
        // Regular edit of pending offer
        const { error } = await supabase
          .from('offers')
          .update({
            title: values.title,
            description: values.description || null,
            price: values.price,
            delivery_time: values.delivery_time,
            images: values.images.length > 0 ? values.images : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editOfferId);

        if (error) {
          console.error('Error actualizando oferta:', error);
          throw error;
        }

        toast({
          title: "¡Oferta actualizada!",
          description: "Tu oferta ha sido actualizada exitosamente"
        });
      } else {
        // Create new offer
        const { error } = await supabase
          .from('offers')
          .insert({
            buy_request_id: targetBuyRequestId,
            seller_id: user.id,
            title: values.title,
            description: values.description || null,
            price: values.price,
            delivery_time: values.delivery_time,
            images: values.images.length > 0 ? values.images : null,
            status: 'pending'
          });

        if (error) {
          console.error('Error insertando oferta:', error);
          throw error;
        }

        toast({
          title: "¡Oferta enviada!",
          description: "Tu oferta ha sido enviada exitosamente"
        });
      }

      navigate(`/buy-request/${targetBuyRequestId}`);
    } catch (error) {
      console.error('Error creating/updating offer:', error);
      toast({
        title: "Error",
        description: `No se pudo ${isCounterOffer ? 'actualizar' : 'enviar'} la oferta. Intenta de nuevo.`,
        variant: "destructive"
      });
    }
  };

  return {
    user,
    buyRequest,
    buyRequestLoading,
    isCounterOffer,
    editOfferId,
    actualBuyRequestId,
    buyRequestId,
    initialFormValues,
    handleSubmit
  };
};
