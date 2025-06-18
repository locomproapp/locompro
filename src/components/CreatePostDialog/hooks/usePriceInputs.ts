
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EditBuyRequestValues } from '@/components/edit-buy-request/schema';
import { parseCurrencyInput } from '@/components/edit-buy-request/utils';

export const usePriceInputs = (form: UseFormReturn<EditBuyRequestValues>) => {
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [priceError, setPriceError] = useState<string | null>(null);

  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinPriceInput(val);
    const parsedValue = parseCurrencyInput(val);
    form.setValue("min_price", parsedValue);
    
    const min = parsedValue;
    const max = parseCurrencyInput(maxPriceInput);
    if (min !== null && max !== null && max < min) {
      setPriceError('Introduzca un precio mayor al precio mínimo.');
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
      setPriceError('Introduzca un precio mayor al precio mínimo.');
    } else {
      setPriceError(null);
    }
  };

  const resetPriceInputs = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setPriceError(null);
  };

  return {
    minPriceInput,
    maxPriceInput,
    priceError,
    handleMinPriceInput,
    handleMaxPriceInput,
    resetPriceInputs
  };
};
