
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { editBuyRequestSchema, EditBuyRequestValues } from '@/components/edit-buy-request/schema';
import { formatCurrency, parseCurrencyInput } from '@/components/edit-buy-request/utils';

export const useCreatePostForm = (onPostCreated?: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<EditBuyRequestValues>({
    resolver: zodResolver(editBuyRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      min_price: null,
      max_price: null,
      zone: '',
      condition: 'cualquiera',
      reference_url: '',
      images: [],
    },
  });

  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [priceError, setPriceError] = useState<string | null>(null);

  // Watch form values
  const watchedValues = form.watch();

  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinPriceInput(val);
    form.setValue("min_price", parseCurrencyInput(val));
    
    const min = parseCurrencyInput(val);
    const max = parseCurrencyInput(maxPriceInput);
    if (min !== null && max !== null && max < min) {
      setPriceError('El máximo debe ser mayor al mínimo');
    } else {
      setPriceError(null);
    }
  };

  const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxPriceInput(val);
    form.setValue("max_price", parseCurrencyInput(val));
    
    const min = parseCurrencyInput(minPriceInput);
    const max = parseCurrencyInput(val);
    if (min !== null && max !== null && max < min) {
      setPriceError('El máximo debe ser mayor al mínimo');
    } else {
      setPriceError(null);
    }
  };

  const handleSubmit = async (values: EditBuyRequestValues) => {
    if (priceError) return;
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión",
        variant: "destructive"
      });
      return;
    }

    if (!values.images || values.images.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir al menos una imagen",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('=== DATOS FINALES PARA LA BASE DE DATOS ===');
      console.log('Valores del form:', JSON.stringify(values, null, 2));

      const { data, error } = await supabase
        .from('buy_requests')
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description || null,
          min_price: values.min_price,
          max_price: values.max_price,
          zone: values.zone,
          condition: values.condition,
          reference_url: values.reference_url || null,
          images: values.images,
          reference_image: values.images[0] || null,
        })
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

      form.reset();
      setMinPriceInput('');
      setMaxPriceInput('');
      setPriceError(null);
      onPostCreated?.();
      
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
    form.reset();
    setMinPriceInput('');
    setMaxPriceInput('');
    setPriceError(null);
  };

  return {
    form,
    loading,
    priceError,
    minPriceInput,
    maxPriceInput,
    handleMinPriceInput,
    handleMaxPriceInput,
    handleSubmit,
    resetForm,
    watchedValues
  };
};
