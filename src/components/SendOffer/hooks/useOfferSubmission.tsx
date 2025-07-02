import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SendOfferFormData } from '../SendOfferForm';

export const useOfferSubmission = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const submitOffer = async (
    values: SendOfferFormData,
    targetBuyRequestId: string,
    isCounterOffer: boolean,
    editOfferId?: string | null
  ) => {
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
      console.log('Delivery time from form:', values.delivery_time);

      // Prepare contact_info object
      const contactInfo = {
        zone: values.zone,
        condition: values.condition,
      };

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

        const now = new Date().toISOString();

        // Update offer for counteroffer - update both updated_at AND created_at to reflect counteroffer time
        const { error } = await supabase
          .from('offers')
          .update({
            title: values.title,
            description: values.description || null,
            price: values.price,
            delivery_time: values.delivery_time, // Make sure this is included in updates
            contact_info: contactInfo,
            images: values.images.length > 0 ? values.images : null,
            status: 'pending',
            rejection_reason: null,
            price_history: priceHistory,
            updated_at: now,
            created_at: now // Update created_at to reflect counteroffer time for proper sorting
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
        // Regular edit of pending offer - don't update timestamps
        const { error } = await supabase
          .from('offers')
          .update({
            title: values.title,
            description: values.description || null,
            price: values.price,
            delivery_time: values.delivery_time, // Make sure this is included in regular edits
            contact_info: contactInfo,
            images: values.images.length > 0 ? values.images : null
            // Note: No timestamp updates for regular edits
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
        // Create new offer - THIS IS THE CRITICAL PATH THAT WAS MISSING delivery_time
        console.log('Creating new offer with delivery_time:', values.delivery_time);
        
        const { error } = await supabase
          .from('offers')
          .insert({
            buy_request_id: targetBuyRequestId,
            seller_id: user.id,
            title: values.title,
            description: values.description || null,
            price: values.price,
            delivery_time: values.delivery_time, // THIS WAS MISSING!
            contact_info: contactInfo,
            images: values.images.length > 0 ? values.images : null,
            status: 'pending'
          });

        if (error) {
          console.error('Error insertando oferta:', error);
          console.error('Full error details:', JSON.stringify(error, null, 2));
          throw error;
        }

        console.log('Offer created successfully with delivery_time:', values.delivery_time);

        toast({
          title: "¡Oferta enviada!",
          description: "Tu oferta ha sido enviada exitosamente"
        });
      }

      // Force a page reload to show the new offer immediately
      setTimeout(() => {
        window.location.href = `/buy-request/${targetBuyRequestId}`;
      }, 1000);

    } catch (error) {
      console.error('Error creating/updating offer:', error);
      toast({
        title: "Error",
        description: `No se pudo ${isCounterOffer ? 'actualizar' : 'enviar'} la oferta. Intenta de nuevo.`,
        variant: "destructive"
      });
    }
  };

  return { submitOffer };
};
