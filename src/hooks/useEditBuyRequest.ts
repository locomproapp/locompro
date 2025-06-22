import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { editBuyRequestSchema, EditBuyRequestValues } from '@/components/edit-buy-request/schema';
import { formatCurrency, parseCurrencyInput } from '@/components/edit-buy-request/utils';
import { toast } from '@/hooks/use-toast';

interface UseEditBuyRequestProps {
  buyRequestId: string;
  open: boolean;
  onSuccess: () => void;
}

export const useEditBuyRequest = ({ buyRequestId, open, onSuccess }: UseEditBuyRequestProps) => {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
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
  
  const fetchBuyRequest = useCallback(async () => {
    if (!buyRequestId) return;
    
    console.log('=== CARGANDO DATOS PARA EDICIÓN ===');
    console.log('Buy Request ID:', buyRequestId);
    
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('buy_requests')
        .select('*')
        .eq('id', buyRequestId)
        .single();

      if (error) {
        console.error('Error fetching buy request:', error);
        throw error;
      }
      
      console.log('=== DATOS OBTENIDOS DE LA BD ===');
      console.log('Data completa:', JSON.stringify(data, null, 2));
      
      // Procesar las imágenes
      let allImages: string[] = [];
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        allImages = data.images;
        console.log('Usando images array:', allImages);
      } else if (data.reference_image) {
        allImages = [data.reference_image];
        console.log('Usando reference_image:', allImages);
      }

      const formData = {
        title: data.title || '',
        description: data.description || '',
        min_price: data.min_price || null,
        max_price: data.max_price || null,
        zone: data.zone || '',
        condition: data.condition || 'cualquiera',
        reference_url: data.reference_url || '',
        images: allImages,
      };

      console.log('=== DATOS PARA EL FORMULARIO ===');
      console.log('Form data:', JSON.stringify(formData, null, 2));

      form.reset(formData);

      // Set raw numeric values for price inputs (without formatting)
      setMinPriceInput(data.min_price ? data.min_price.toString() : '');
      setMaxPriceInput(data.max_price ? data.max_price.toString() : '');
      
      console.log('=== PRECIOS SIN FORMATO ===');
      console.log('Min price input:', data.min_price ? data.min_price.toString() : '');
      console.log('Max price input:', data.max_price ? data.max_price.toString() : '');
      
    } catch (error) {
      console.error('Error fetching buy request:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    } finally {
      setIsFetching(false);
    }
  }, [buyRequestId, form]);

  useEffect(() => {
    if (open && buyRequestId) {
      console.log('Modal abierto, cargando datos...');
      fetchBuyRequest();
    }
  }, [open, buyRequestId, fetchBuyRequest]);

  useEffect(() => {
    const min = minPriceInput ? parseInt(minPriceInput.replace(/\D/g, ''), 10) : null;
    const max = maxPriceInput ? parseInt(maxPriceInput.replace(/\D/g, ''), 10) : null;
    
    if (min !== null && max !== null && max < min) {
      setPriceError('El máximo debe ser mayor al mínimo');
    } else {
      setPriceError(null);
    }
  }, [minPriceInput, maxPriceInput]);

  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract only numeric value
    const numericValue = e.target.value.replace(/\D/g, '');
    setMinPriceInput(numericValue);
    form.setValue("min_price", numericValue ? parseInt(numericValue, 10) : null);
  };
  
  const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract only numeric value
    const numericValue = e.target.value.replace(/\D/g, '');
    setMaxPriceInput(numericValue);
    form.setValue("max_price", numericValue ? parseInt(numericValue, 10) : null);
  };
  
  const onSubmit = async (values: EditBuyRequestValues) => {
    if (priceError) return;
    
    console.log('=== ENVIANDO ACTUALIZACIÓN ===');
    console.log('Valores del formulario:', JSON.stringify(values, null, 2));
    
    setLoading(true);
    try {
      const updateData = {
        title: values.title,
        description: values.description || null,
        min_price: values.min_price,
        max_price: values.max_price,
        zone: values.zone,
        condition: values.condition,
        reference_url: values.reference_url || null,
        images: values.images,
        reference_image: values.images && values.images.length > 0 ? values.images[0] : null,
        updated_at: new Date().toISOString()
      };

      console.log('=== DATOS PARA ACTUALIZAR ===');
      console.log('Update data:', JSON.stringify(updateData, null, 2));

      const { data, error } = await supabase
        .from('buy_requests')
        .update(updateData)
        .eq('id', buyRequestId)
        .select()
        .single();

      if (error) {
        console.error('Error updating buy request:', error);
        throw error;
      }

      console.log('=== ACTUALIZACIÓN EXITOSA ===');
      console.log('Updated data:', JSON.stringify(data, null, 2));

      toast({
        title: "¡Éxito!",
        description: "Solicitud actualizada correctamente"
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la solicitud",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    isFetching,
    priceError,
    minPriceInput,
    maxPriceInput,
    handleMinPriceInput,
    handleMaxPriceInput,
    onSubmit,
  };
};
