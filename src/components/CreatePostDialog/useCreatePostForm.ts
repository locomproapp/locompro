
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editBuyRequestSchema, EditBuyRequestValues } from '@/components/edit-buy-request/schema';
import { useFormSubmission } from './hooks/useFormSubmission';
import { useState, useEffect } from 'react';

export const useCreatePostForm = (onPostCreated?: () => void) => {
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

  const { loading, handleSubmit: submitForm } = useFormSubmission(onPostCreated);

  // Validación de precios
  useEffect(() => {
    const min = minPriceInput ? parseInt(minPriceInput, 10) : null;
    const max = maxPriceInput ? parseInt(maxPriceInput, 10) : null;
    
    if (min !== null && max !== null && max < min) {
      setPriceError('Introduzca un precio mayor al precio mínimo.');
    } else {
      setPriceError(null);
    }
  }, [minPriceInput, maxPriceInput]);

  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Only keep digits
    setMinPriceInput(val);
    form.setValue("min_price", val ? parseInt(val, 10) : null);
  };
  
  const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Only keep digits
    setMaxPriceInput(val);
    form.setValue("max_price", val ? parseInt(val, 10) : null);
  };

  const watchedValues = form.watch();

  const handleSubmit = async (values: EditBuyRequestValues) => {
    console.log('=== SUBMIT DESDE useCreatePostForm ===');
    console.log('Values before processing:', JSON.stringify(values, null, 2));
    
    if (!values.title || values.title.trim() === '') {
      console.error('Title is empty');
      return;
    }
    
    if (!values.zone || values.zone.trim() === '') {
      console.error('Zone is empty');
      return;
    }
    
    if (!values.images || values.images.length === 0) {
      console.error('No images provided');
      return;
    }
    
    await submitForm(values, priceError);
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
