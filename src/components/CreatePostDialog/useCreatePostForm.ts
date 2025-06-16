
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editBuyRequestSchema, EditBuyRequestValues } from '@/components/edit-buy-request/schema';
import { usePriceInputs } from './hooks/usePriceInputs';
import { useFormSubmission } from './hooks/useFormSubmission';

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

  const {
    minPriceInput,
    maxPriceInput,
    priceError,
    handleMinPriceInput,
    handleMaxPriceInput,
    resetPriceInputs
  } = usePriceInputs(form);

  const { loading, handleSubmit: submitForm } = useFormSubmission(onPostCreated);

  // Watch form values
  const watchedValues = form.watch();

  const handleSubmit = async (values: EditBuyRequestValues) => {
    await submitForm(values, priceError);
  };

  const resetForm = () => {
    form.reset();
    resetPriceInputs();
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
