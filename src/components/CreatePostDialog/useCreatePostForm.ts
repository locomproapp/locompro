
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

    // VERIFICACIÓN EXHAUSTIVA: Verificar cada campo antes de armar insertData
    console.log('=== VERIFICACIÓN CAMPO POR CAMPO ===');
    console.log('title:', values.title, '(tipo:', typeof values.title, ')');
    console.log('description (raw):', values.description, '(tipo:', typeof values.description, ', length:', values.description?.length || 0, ')');
    console.log('condition (raw):', values.condition, '(tipo:', typeof values.condition, ')');
    console.log('reference_url (raw):', values.reference_url, '(tipo:', typeof values.reference_url, ', length:', values.reference_url?.length || 0, ')');
    console.log('images (raw):', values.images, '(tipo:', typeof values.images, ', isArray:', Array.isArray(values.images), ', length:', values.images?.length || 0, ')');

    setLoading(true);
    try {
      // LIMPIEZA EXHAUSTIVA DE DATOS ANTES DEL INSERT
      const cleanDescription = values.description && typeof values.description === 'string' && values.description.trim() !== '' 
        ? values.description.trim() 
        : null;
      
      const cleanCondition = values.condition && typeof values.condition === 'string' && values.condition !== '' 
        ? values.condition 
        : null;
      
      const cleanReferenceUrl = values.reference_url && typeof values.reference_url === 'string' && values.reference_url.trim() !== '' 
        ? values.reference_url.trim() 
        : null;
      
      const cleanImages = Array.isArray(values.images) && values.images.length > 0 
        ? values.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
        : null;
      
      const cleanReferenceImage = cleanImages && cleanImages.length > 0 
        ? cleanImages[0] 
        : null;

      console.log('=== DATOS LIMPIOS PROCESADOS ===');
      console.log('cleanDescription:', cleanDescription, '(tipo:', typeof cleanDescription, ')');
      console.log('cleanCondition:', cleanCondition, '(tipo:', typeof cleanCondition, ')');
      console.log('cleanReferenceUrl:', cleanReferenceUrl, '(tipo:', typeof cleanReferenceUrl, ')');
      console.log('cleanImages:', cleanImages, '(tipo:', typeof cleanImages, ', isArray:', Array.isArray(cleanImages), ', length:', cleanImages?.length || 'N/A', ')');
      console.log('cleanReferenceImage:', cleanReferenceImage, '(tipo:', typeof cleanReferenceImage, ')');

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
