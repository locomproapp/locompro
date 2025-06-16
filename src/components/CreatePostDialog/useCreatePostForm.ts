
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
    const parsedValue = parseCurrencyInput(val);
    form.setValue("min_price", parsedValue);
    
    const min = parsedValue;
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
    const parsedValue = parseCurrencyInput(val);
    form.setValue("max_price", parsedValue);
    
    const min = parseCurrencyInput(minPriceInput);
    const max = parsedValue;
    if (min !== null && max !== null && max < min) {
      setPriceError('El máximo debe ser mayor al mínimo');
    } else {
      setPriceError(null);
    }
  };

  const handleSubmit = async (values: EditBuyRequestValues) => {
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

    if (!values.images || values.images.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir al menos una imagen",
        variant: "destructive"
      });
      return;
    }

    console.log('=== INICIANDO CREACIÓN ===');
    console.log('Valores del formulario RAW:', JSON.stringify(values, null, 2));
    console.log('Usuario ID:', user.id);

    setLoading(true);
    try {
      // REVISIÓN EXHAUSTIVA: Verificar cada campo antes de armar insertData
      console.log('=== VERIFICACIÓN CAMPO POR CAMPO ===');
      console.log('title:', values.title);
      console.log('description (raw):', values.description);
      console.log('description (processed):', values.description || null);
      console.log('condition (raw):', values.condition);
      console.log('reference_url (raw):', values.reference_url);
      console.log('reference_url (processed):', values.reference_url || null);
      console.log('images (raw):', values.images);
      console.log('images length:', values.images?.length || 0);
      console.log('reference_image (será):', values.images?.[0] || null);

      const insertData = {
        user_id: user.id,
        title: values.title,
        description: values.description && values.description.trim() !== '' ? values.description : null,
        min_price: values.min_price,
        max_price: values.max_price,
        zone: values.zone,
        condition: values.condition,
        reference_url: values.reference_url && values.reference_url.trim() !== '' ? values.reference_url : null,
        images: values.images && values.images.length > 0 ? values.images : null,
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

      // PRUEBA DE VALIDACIÓN: Fetch inmediato para verificar lo que realmente se guardó
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
        
        // Comparación campo por campo
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

      form.reset();
      setMinPriceInput('');
      setMaxPriceInput('');
      setPriceError(null);
      onPostCreated?.();
      
      // Esperar un poco para asegurar que los datos estén propagados en Supabase
      // antes de navegar al detalle
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
