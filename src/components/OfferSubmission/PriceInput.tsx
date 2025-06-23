
import React from 'react';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PriceInputProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  error?: string;
}

export const PriceInput = ({ value, onChange, error }: PriceInputProps) => {
  const [displayValue, setDisplayValue] = React.useState('');

  React.useEffect(() => {
    if (value === undefined || value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue('$' + value.toLocaleString('es-AR'));
    }
  }, [value]);

  const formatPriceDisplay = (inputValue: string): string => {
    // Remove everything that's not a digit
    const numericValue = inputValue.replace(/[^\d]/g, '');
    
    if (numericValue === '') return '';
    
    // Convert to number and format with period as thousand separator
    const number = parseInt(numericValue);
    const formatted = number.toLocaleString('es-AR');
    
    return `$${formatted}`;
  };

  const parseFormattedPrice = (formattedValue: string): number | undefined => {
    const numericValue = formattedValue.replace(/[^\d]/g, '');
    return numericValue === '' ? undefined : parseInt(numericValue);
  };

  const handlePriceChange = (inputValue: string) => {
    const formatted = formatPriceDisplay(inputValue);
    setDisplayValue(formatted);
    
    const numericValue = parseFormattedPrice(formatted);
    onChange(numericValue);
  };

  return (
    <FormItem>
      <FormLabel>Precio *</FormLabel>
      <Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={(e) => handlePriceChange(e.target.value)}
        placeholder="$0"
        className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
