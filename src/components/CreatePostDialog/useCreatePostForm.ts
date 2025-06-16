
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
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'max_price' || field === 'min_price') {
      setShowMaxPriceError(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

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
      const dataToInsert = {
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        min_price: formData.min_price ? parseFloat(formData.min_price) : null,
        max_price: formData.max_price ? parseFloat(formData.max_price) : null,
        reference_url: formData.reference_url || null,
        zone: formData.zone,
        condition: formData.condition || 'cualquiera',
        images: formData.images.length > 0 ? formData.images : null,
        reference_image: formData.images.length > 0 ? formData.images[0] : null
      };

      console.log('Datos que se van a insertar en buy_requests:', dataToInsert);

      const { data, error } = await supabase
        .from('buy_requests')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        console.error('Error al crear buy request:', error);
        throw error;
      }

      console.log('Buy request creado exitosamente:', data);

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
