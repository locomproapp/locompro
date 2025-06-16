
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
    minPrice: '',
    maxPrice: '',
    referenceLink: '',
    zone: '',
    contactInfo: 'cualquiera',
    images: []
  });

  const [touched, setTouched] = useState(false);
  const [showMaxPriceError, setShowMaxPriceError] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'maxPrice' || field === 'minPrice') {
      setShowMaxPriceError(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const priceIsInvalid = isMaxPriceInvalid(formData.minPrice, formData.maxPrice);
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
      const imagesArray = Array.isArray(formData.images) ? formData.images : [];

      const { data, error } = await supabase
        .from('buy_requests')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          min_price: formData.minPrice ? parseFloat(formData.minPrice) : null,
          max_price: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
          reference_url: formData.referenceLink || null,
          zone: formData.zone,
          condition: formData.contactInfo || 'cualquiera',
          images: imagesArray.length > 0 ? imagesArray : null,
          reference_image: imagesArray.length > 0 ? imagesArray[0] : null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating buy request:', error);
        throw error;
      }

      console.log('Buy request created successfully:', data);

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
      minPrice: '',
      maxPrice: '',
      referenceLink: '',
      zone: '',
      contactInfo: 'cualquiera',
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
