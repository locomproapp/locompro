
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FormData } from './types';
import { isValidPrice, isMaxPriceInvalid } from './validation';

export const useCreatePostForm = (onPostCreated?: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    min_price: '',
    max_price: '',
    reference_url: '',
    zone: '',
    condition: 'cualquiera',
    images: []
  });

  const [touched, setTouched] = useState(false);
  const [showMaxPriceError, setShowMaxPriceError] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    console.log(`=== HANDLE INPUT CHANGE ===`);
    console.log(`Campo ${field} cambiando de "${formData[field]}" a "${value}"`);
    
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value };
      console.log('FormData después del cambio:', JSON.stringify(newFormData, null, 2));
      return newFormData;
    });
    
    if (field === 'max_price' || field === 'min_price') {
      setShowMaxPriceError(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    console.log('=== HANDLE IMAGES CHANGE ===');
    console.log('Imágenes anteriores:', formData.images);
    console.log('Imágenes nuevas:', images);
    
    setFormData(prev => {
      const newFormData = { ...prev, images };
      console.log('FormData después del cambio de imágenes:', JSON.stringify(newFormData, null, 2));
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    console.log('=== INICIANDO SUBMIT ===');
    console.log('FormData en el momento del submit:', JSON.stringify(formData, null, 2));
    console.log('Detalles específicos:');
    console.log('- title:', `"${formData.title}"`);
    console.log('- description:', `"${formData.description}"`);
    console.log('- condition:', `"${formData.condition}"`);
    console.log('- reference_url:', `"${formData.reference_url}"`);
    console.log('- images:', formData.images);
    console.log('- min_price:', `"${formData.min_price}"`);
    console.log('- max_price:', `"${formData.max_price}"`);
    console.log('- zone:', `"${formData.zone}"`);

    const priceIsInvalid = isMaxPriceInvalid(formData.min_price, formData.max_price);
    if (priceIsInvalid) {
      setShowMaxPriceError(true);
    }

    if (!user || !formData.title || !formData.zone) {
      toast({
        title: "Error",
        description: "Completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir al menos una imagen",
        variant: "destructive"
      });
      return;
    }

    if (priceIsInvalid) {
      return;
    }

    setLoading(true);
    try {
      // Procesar los datos asegurando que no se pierdan
      const processedData = {
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description && formData.description.trim() ? formData.description.trim() : null,
        min_price: formData.min_price ? parseFloat(formData.min_price) : null,
        max_price: formData.max_price ? parseFloat(formData.max_price) : null,
        reference_url: formData.reference_url && formData.reference_url.trim() ? formData.reference_url.trim() : null,
        zone: formData.zone.trim(),
        condition: formData.condition || 'cualquiera',
        images: formData.images && formData.images.length > 0 ? formData.images : null,
        reference_image: formData.images && formData.images.length > 0 ? formData.images[0] : null
      };

      console.log('=== DATOS FINALES PARA LA BASE DE DATOS ===');
      console.log('FormData original:', JSON.stringify(formData, null, 2));
      console.log('Datos procesados:', JSON.stringify(processedData, null, 2));
      console.log('description final:', processedData.description);
      console.log('condition final:', processedData.condition);
      console.log('reference_url final:', processedData.reference_url);
      console.log('images final:', processedData.images);

      const { data, error } = await supabase
        .from('buy_requests')
        .insert(processedData)
        .select()
        .single();

      if (error) {
        console.error('Error al crear buy request:', error);
        throw error;
      }

      console.log('=== RESPUESTA DE LA BASE DE DATOS ===');
      console.log('Buy request creado exitosamente:', JSON.stringify(data, null, 2));

      toast({
        title: "¡Éxito!",
        description: "Publicación creada correctamente"
      });

      resetForm();
      onPostCreated?.();
      
      // Redirigir al detalle de la publicación creada
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      min_price: '',
      max_price: '',
      reference_url: '',
      zone: '',
      condition: 'cualquiera',
      images: []
    });
    setTouched(false);
    setShowMaxPriceError(false);
  };

  return {
    formData,
    loading,
    touched,
    showMaxPriceError,
    handleInputChange,
    handleImagesChange,
    handleSubmit,
    resetForm
  };
};
