
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BuyRequestFormData } from './useBuyRequestForm';

export const useBuyRequestSubmit = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const submitBuyRequest = async (formData: BuyRequestFormData) => {
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    if (formData.images.length === 0) {
      throw new Error("Imágenes requeridas");
    }

    if (!formData.condition) {
      throw new Error("Condición requerida");
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('buy_requests')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          min_price: formData.minPrice ? parseFloat(formData.minPrice) : null,
          max_price: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
          zone: formData.zone,
          reference_image: formData.images[0]
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error creating buy request:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitBuyRequest,
    loading
  };
};
