
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { BuyRequestFormData } from './useBuyRequestForm';

export const useBuyRequestSubmit = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const submitBuyRequest = async (formData: BuyRequestFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una solicitud de compra",
        variant: "destructive"
      });
      throw new Error("Usuario no autenticado");
    }

    if (formData.images.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir al menos una imagen de referencia",
        variant: "destructive"
      });
      throw new Error("Imágenes requeridas");
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

      toast({
        title: "¡Éxito!",
        description: "Solicitud de compra creada correctamente. ¡Los vendedores podrán enviarte ofertas!"
      });
    } catch (error) {
      console.error('Error creating buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud de compra",
        variant: "destructive"
      });
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
