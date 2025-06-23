
import React, { useState, useEffect } from 'react';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PriceInputProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  error?: string;
}

export const PriceInput = ({ value, onChange, error }: PriceInputProps) => {
  const [displayValue, setDisplayValue] = useState('$');

  // Format price with thousand separators
  const formatPrice = (numericValue: string): string => {
    if (numericValue === '') return '$';
    
    const number = parseInt(numericValue);
    const formatted = number.toLocaleString('es-AR'); // Argentina locale uses periods
    return `$${formatted}`;
  };

  // Extract numeric value from formatted string
  const parsePrice = (formattedValue: string): number | undefined => {
    const numericValue = formattedValue.replace(/[^\d]/g, '');
    return numericValue === '' ? undefined : parseInt(numericValue);
  };

  // Handle input changes
  const handleInputChange = (inputValue: string) => {
    // Always ensure it starts with $
    let processedValue = inputValue;
    if (!inputValue.startsWith('$')) {
      processedValue = '$' + inputValue.replace(/[^\d]/g, '');
    }

    // Format the display value
    const numericOnly = processedValue.replace(/[^\d]/g, '');
    const formattedDisplay = formatPrice(numericOnly);
    setDisplayValue(formattedDisplay);

    // Update form value
    const numericValue = parsePrice(formattedDisplay);
    onChange(numericValue);
  };

  // Update display value when form value changes externally
  useEffect(() => {
    if (value === undefined || value === 0) {
      setDisplayValue('$');
    } else {
      setDisplayValue(formatPrice(value.toString()));
    }
  }, [value]);

  return (
    <FormItem>
      <FormLabel>Precio *</FormLabel>
      <Input
        type="text"
        placeholder="$"
        value={displayValue}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
