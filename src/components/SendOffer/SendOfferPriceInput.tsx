
import React, { useState, useEffect } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SendOfferFormData } from './SendOfferForm';

interface SendOfferPriceInputProps {
  control: Control<SendOfferFormData>;
}

export const SendOfferPriceInput = ({ control }: SendOfferPriceInputProps) => {
  const [priceDisplayValue, setPriceDisplayValue] = useState('');
  const priceValue = useWatch({ control, name: 'price' });

  // Price formatting functions
  const formatPriceDisplay = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue === '') return '';
    const number = parseInt(numericValue);
    const formatted = number.toLocaleString('es-AR');
    return `$${formatted}`;
  };

  const parseFormattedPrice = (formattedValue: string): number | undefined => {
    const numericValue = formattedValue.replace(/[^\d]/g, '');
    return numericValue === '' ? undefined : parseInt(numericValue);
  };

  // Initialize display value when price value changes (for edit mode)
  useEffect(() => {
    if (priceValue && !priceDisplayValue) {
      setPriceDisplayValue(formatPriceDisplay(priceValue.toString()));
    }
  }, [priceValue, priceDisplayValue]);

  return (
    <FormField
      control={control}
      name="price"
      render={({ field }) => {
        const handlePriceChange = (inputValue: string) => {
          const formatted = formatPriceDisplay(inputValue);
          setPriceDisplayValue(formatted);
          const numericValue = parseFormattedPrice(formatted);
          field.onChange(numericValue);
        };

        return (
          <FormItem>
            <FormLabel>Precio</FormLabel>
            <FormControl>
              <Input 
                type="text"
                inputMode="numeric"
                placeholder="$0"
                value={priceDisplayValue}
                onChange={(e) => handlePriceChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
