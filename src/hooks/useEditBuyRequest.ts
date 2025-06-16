
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { editBuyRequestSchema, EditBuyRequestValues } from '@/components/edit-buy-request/schema';
import { formatCurrency, parseCurrencyInput } from '@/components/edit-buy-request/utils';

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
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('buy_requests')
        .select('*')
        .eq('id', buyRequestId)
        .single();

      if (error) throw error;
      
      // Usar las imágenes del campo images si existe, si no usar reference_image
      const allImages = data.images?.length ? data.images : (data.reference_image ? [data.reference_image] : []);

      form.reset({
        title: data.title || '',
        description: data.description || '',
        min_price: data.min_price || null,
        max_price: data.max_price || null,
        zone: data.zone || '',
        condition: data.condition || 'cualquiera',
        reference_url: data.reference_url || '',
        images: allImages,
      });

      // Actualizar los inputs de precio formateados
      setMinPriceInput(formatCurrency(data.min_price));
      setMaxPriceInput(formatCurrency(data.max_price));
    } catch (error) {
      console.error('Error fetching buy request:', error);
    } finally {
        setIsFetching(false);
    }
  }, [buyRequestId, form]);

  useEffect(() => {
    if (open && buyRequestId) {
      fetchBuyRequest();
    }
  }, [open, buyRequestId, fetchBuyRequest]);

  useEffect(() => {
    const min = parseCurrencyInput(minPriceInput);
    const max = parseCurrencyInput(maxPriceInput);
    if (min !== null && max !== null && max < min) {
      setPriceError('El máximo debe ser mayor al mínimo');
    } else {
      setPriceError(null);
    }
  }, [minPriceInput, maxPriceInput]);

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
  
  const onSubmit = async (values: EditBuyRequestValues) => {
    if (priceError) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('buy_requests')
        .update({
          title: values.title,
          description: values.description || null,
          min_price: values.min_price,
          max_price: values.max_price,
          zone: values.zone,
          condition: values.condition,
          reference_url: values.reference_url || null,
          images: values.images,
          reference_image: values.images[0] || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', buyRequestId);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error updating buy request:', error);
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
