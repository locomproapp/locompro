
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PriceInputFieldsProps {
  minPriceValue: number;
  maxPriceValue: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}

const PriceInputFields = ({ 
  minPriceValue, 
  maxPriceValue, 
  onMinPriceChange, 
  onMaxPriceChange 
}: PriceInputFieldsProps) => {
  const formatCurrency = (value: number) => {
    if (value === 0) return '';
    return `$${value.toLocaleString('es-AR')}`;
  };

  const parseCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  return (
    <div>
      <FormLabel>Precio</FormLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <FormItem>
          <FormLabel>Precio Mínimo</FormLabel>
          <FormControl>
            <Input
              type="text"
              inputMode="numeric"
              value={formatCurrency(minPriceValue)}
              onChange={(e) => onMinPriceChange(parseCurrency(e.target.value))}
              placeholder="$0"
              autoComplete="off"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Precio Máximo</FormLabel>
          <FormControl>
            <Input
              type="text"
              inputMode="numeric"
              value={formatCurrency(maxPriceValue)}
              onChange={(e) => onMaxPriceChange(parseCurrency(e.target.value))}
              placeholder="$0"
              autoComplete="off"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
    </div>
  );
};

export default PriceInputFields;
