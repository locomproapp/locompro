
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { EditBuyRequestValues } from '@/components/edit-buy-request/schema';

export const useFormSubmission = (onPostCreated?: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: EditBuyRequestValues, priceError: string | null) => {
    if (priceError) {
      console.log('=== ERROR DE PRECIO ===');
      console.log('Price error:', priceError);
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión",
        variant: "destructive"
      });
      return;
    }

    // Validación de imágenes requeridas
    if (!values.images || values.images.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir al menos una imagen",
        variant: "destructive"
      });
      return;
    }

    console.log('=== INICIANDO CREACIÓN ===');
    console.log('Valores del formulario:', JSON.stringify(values, null, 2));
    console.log('Usuario ID:', user.id);

    setLoading(true);
    try {
      // Usar la misma lógica que el modal de edición para preparar los datos
      const insertData = {
        user_id: user.id,
        title: values.title,
        description: values.description || null,
        min_price: values.min_price,
        max_price: values.max_price,
        zone: values.zone,
        condition: values.condition,
        reference_url: values.reference_url || null,
        images: values.images,
        reference_image: values.images && values.images.length > 0 ? values.images[0] : null,
      };

      console.log('=== DATOS PARA INSERTAR (FINAL) ===');
      console.log('Insert data:', JSON.stringify(insertData, null, 2));

      const { data, error } = await supabase
        .from('buy_requests')
        .insert(insertData)
        .select(`
          *,
          categories (name),
          profiles (
            full_name,
            avatar_url,
            bio,
            location
          )
        `)
        .single();

      if (error) {
        console.error('=== ERROR EN INSERT ===');
        console.error('Error al crear buy request:', error);
        throw error;
      }

      console.log('=== DATOS DESDE INSERT (RESPUESTA INMEDIATA) ===');
      console.log(JSON.stringify(data, null, 2));

      toast({
        title: "¡Éxito!",
        description: "Publicación creada correctamente"
      });

      onPostCreated?.();
      
      console.log('=== ESPERANDO PROPAGACIÓN DE DATOS ===');
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      console.log('=== NAVEGANDO AL DETALLE ===');
      navigate(`/buy-request/${data.id}`);
    } catch (error) {
      console.error('Error creating buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la publicación",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
};
