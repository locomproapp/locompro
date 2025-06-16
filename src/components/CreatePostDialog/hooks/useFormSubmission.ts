
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
    console.log('Valores del formulario recibidos:', JSON.stringify(values, null, 2));
    console.log('Usuario ID:', user.id);
    console.log('Auth UID:', (await supabase.auth.getUser()).data.user?.id);

    setLoading(true);
    try {
      // IMPORTANTE: Usar exactamente la misma lógica que useEditBuyRequest
      const insertData = {
        user_id: user.id,
        title: values.title.trim(),
        description: values.description && values.description.trim() !== '' ? values.description.trim() : null,
        min_price: values.min_price,
        max_price: values.max_price,
        zone: values.zone.trim(),
        condition: values.condition || 'cualquiera',
        reference_url: values.reference_url && values.reference_url.trim() !== '' ? values.reference_url.trim() : null,
        images: values.images || [],
        reference_image: values.images && values.images.length > 0 ? values.images[0] : null,
      };

      console.log('=== DATOS PARA INSERTAR (FINALES) ===');
      console.log('Insert data:', JSON.stringify(insertData, null, 2));
      console.log('Campos críticos:');
      console.log('- description:', insertData.description);
      console.log('- condition:', insertData.condition);  
      console.log('- reference_url:', insertData.reference_url);
      console.log('- images length:', insertData.images?.length);

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
        console.error('Error completo:', error);
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
        throw error;
      }

      console.log('=== DATOS DESDE INSERT (RESPUESTA INMEDIATA) ===');
      console.log('Data returned:', JSON.stringify(data, null, 2));
      console.log('Verificación de campos guardados:');
      console.log('- description guardado:', data.description);
      console.log('- condition guardado:', data.condition);
      console.log('- reference_url guardado:', data.reference_url);
      console.log('- images guardadas:', data.images);

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
