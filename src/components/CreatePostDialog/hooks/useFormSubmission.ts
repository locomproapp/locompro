
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { EditBuyRequestValues } from '@/components/edit-buy-request/schema';
import { cleanFormData, validateFormData } from '../utils/formValidation';

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

    const validationError = validateFormData(values);
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    console.log('=== INICIANDO CREACIÓN ===');
    console.log('Valores del formulario RAW:', JSON.stringify(values, null, 2));
    console.log('Usuario ID:', user.id);

    setLoading(true);
    try {
      const {
        cleanDescription,
        cleanCondition,
        cleanReferenceUrl,
        cleanImages,
        cleanReferenceImage
      } = cleanFormData(values);

      const insertData = {
        user_id: user.id,
        title: values.title,
        description: cleanDescription,
        min_price: values.min_price,
        max_price: values.max_price,
        zone: values.zone,
        condition: cleanCondition,
        reference_url: cleanReferenceUrl,
        images: cleanImages,
        reference_image: cleanReferenceImage,
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

      // Validación con fetch independiente
      console.log('=== INICIANDO VALIDACIÓN CON FETCH INDEPENDIENTE ===');
      const { data: validatedData, error: fetchError } = await supabase
        .from('buy_requests')
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
        .eq('id', data.id)
        .single();

      if (fetchError) {
        console.error('=== ERROR EN FETCH DE VALIDACIÓN ===');
        console.error('Error al validar datos:', fetchError);
      } else {
        console.log('=== DATOS VALIDANDO (FETCH INDEPENDIENTE) ===');
        console.log(JSON.stringify(validatedData, null, 2));
        
        console.log('=== COMPARACIÓN CAMPO POR CAMPO ===');
        console.log('description - insertData:', insertData.description, '| validatedData:', validatedData.description);
        console.log('condition - insertData:', insertData.condition, '| validatedData:', validatedData.condition);
        console.log('reference_url - insertData:', insertData.reference_url, '| validatedData:', validatedData.reference_url);
        console.log('images - insertData:', insertData.images, '| validatedData:', validatedData.images);
        console.log('reference_image - insertData:', insertData.reference_image, '| validatedData:', validatedData.reference_image);
      }

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
