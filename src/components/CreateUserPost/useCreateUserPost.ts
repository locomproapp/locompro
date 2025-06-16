
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { userPostSchema, UserPostValues } from './schema';
import { formatCurrency, parseCurrencyInput } from '@/components/edit-buy-request/utils';

export const useCreateUserPost = (onPostCreated?: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<UserPostValues>({
    resolver: zodResolver(userPostSchema),
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

  // Manejo de precios con formato
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [priceError, setPriceError] = useState<string | null>(null);

  // Validación de precios
  useEffect(() => {
    const min = parseCurrencyInput(minPriceInput);
    const max = parseCurrencyInput(maxPriceInput);
    if (min !== null && max !== null && max < min) {
      setPriceError('El máximo debe ser mayor al mínimo');
    } else {
      setPriceError(null);
    }
  }, [minPriceInput, maxPriceInput]);

  // Handlers de precio
  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinPriceInput(val);
    form.setValue("min_price", parseCurrencyInput(val));
  };
  
  const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxPriceInput(val);
    form.setValue("max_price", parseCurrencyInput(val));
  };

  const handleSubmit = async (values: UserPostValues) => {
    if (priceError) {
      console.log('Error de precio:', priceError);
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

    console.log('=== CREANDO USER POST ===');
    console.log('Valores del formulario:', JSON.stringify(values, null, 2));

    setLoading(true);
    try {
      // Preparar datos para insertar
      const insertData = {
        user_id: user.id,
        title: values.title.trim(),
        description: values.description && values.description.trim() !== '' ? values.description.trim() : null,
        min_price: values.min_price,
        max_price: values.max_price,
        zone: values.zone.trim(),
        condition: values.condition,
        reference_url: values.reference_url && values.reference_url.trim() !== '' ? values.reference_url.trim() : null,
        images: values.images,
        reference_image: values.images && values.images.length > 0 ? values.images[0] : null,
      };

      console.log('=== DATOS PARA INSERTAR ===');
      console.log('Insert data:', JSON.stringify(insertData, null, 2));

      const { data, error } = await supabase
        .from('user_posts')
        .insert(insertData)
        .select(`
          *,
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
        throw error;
      }

      console.log('=== PUBLICACIÓN CREADA EXITOSAMENTE ===');
      console.log('Data returned:', JSON.stringify(data, null, 2));

      toast({
        title: "¡Éxito!",
        description: "Publicación creada correctamente"
      });

      onPostCreated?.();
      
      // Navegar al detalle de la nueva publicación
      navigate(`/user-post/${data.id}`);
    } catch (error) {
      console.error('Error creating user post:', error);
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
    watchedValues: form.watch()
  };
};
