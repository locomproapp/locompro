
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { OfferSubmissionData } from './offerSubmissionSchema';

interface UseOfferSubmissionProps {
  buyRequestId: string;
  onSuccess: () => void;
}

export const useOfferSubmission = ({ buyRequestId, onSuccess }: UseOfferSubmissionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOffer = async (data: OfferSubmissionData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes estar logueado para enviar una oferta',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting offer with data:', data);

      const offerData = {
        buy_request_id: buyRequestId,
        seller_id: user.id,
        title: data.title,
        price: data.price,
        description: data.description,
        images: data.images,
        status: 'pending',
        contact_info: {
          zone: data.zone,
          condition: data.condition,
        },
      };

      console.log('Inserting offer:', offerData);

      const { data: insertedOffer, error } = await supabase
        .from('offers')
        .insert(offerData)
        .select(`
          *,
          profiles!offers_seller_id_fkey (
            full_name,
            email,
            location
          )
        `)
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Offer inserted successfully:', insertedOffer);

      toast({
        title: '¡Oferta enviada!',
        description: 'Tu oferta ha sido enviada exitosamente',
      });

      // Force a small delay to ensure database changes are propagated
      setTimeout(() => {
        onSuccess();
      }, 500);

    } catch (err) {
      console.error('Error sending offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo enviar la oferta. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOffer,
    isSubmitting,
  };
};
