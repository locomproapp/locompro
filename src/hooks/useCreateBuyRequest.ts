
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { BuyRequestFormData } from '@/components/BuyRequest/schema';

export const useCreateBuyRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createBuyRequest = async (data: BuyRequestFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const insertData = {
        user_id: user.id,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        min_price: data.min_price,
        max_price: data.max_price,
        zone: data.zone.trim(),
        condition: data.condition,
        reference_url: data.reference_url?.trim() || null,
        images: data.images,
      };

      const { data: newRequest, error } = await supabase
        .from('buy_requests')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Solicitud creada correctamente"
      });

      navigate(`/buy-request/${newRequest.id}`);
    } catch (error) {
      console.error('Error creating buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createBuyRequest,
    loading
  };
};
