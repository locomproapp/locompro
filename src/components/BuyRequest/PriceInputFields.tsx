
import React, { useState, useEffect } from 'react';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PriceInputFieldsProps {
  minPriceValue: number;
  maxPriceValue: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}

// Currency formatting functions
function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number" || isNaN(value) || value === 0) return "$";
  return (
    "$" +
    value
      .toLocaleString("es-AR", {
        maximumFractionDigits: 0,
        useGrouping: true,
      })
      .replace(/,/g, ".")
  );
}

function parseCurrencyInput(input: string) {
  if (!input || input === "$") return 0;
  const cleaned = input.replace(/\D/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

const PriceInputFields = ({ 
  minPriceValue, 
  maxPriceValue, 
  onMinPriceChange, 
  onMaxPriceChange 
}: PriceInputFieldsProps) => {
  const [minPriceInput, setMinPriceInput] = useState("$");
  const [maxPriceInput, setMaxPriceInput] = useState("$");
  const [priceError, setPriceError] = useState<string | null>(null);

  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseCurrencyInput(e.target.value);
    setMinPriceInput(formatCurrency(value));
    onMinPriceChange(value);
  };

  const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseCurrencyInput(e.target.value);
    setMaxPriceInput(formatCurrency(value));
    onMaxPriceChange(value);
  };

  // Validation effect
  useEffect(() => {
    const minPrice = parseCurrencyInput(minPriceInput);
    const maxPrice = parseCurrencyInput(maxPriceInput);
    
    if (minPrice > 0 && maxPrice > 0 && minPrice > maxPrice) {
      setPriceError("Introduzca un precio mayor al precio mínimo");
    } else {
      setPriceError(null);
    }
  }, [minPriceInput, maxPriceInput]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormItem>
        <FormLabel>Precio Mínimo *</FormLabel>
        <FormControl>
          <Input
            type="text"
            inputMode="numeric"
            value={minPriceInput}
            placeholder="$"
            autoComplete="off"
            onChange={handleMinPriceInput}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
      <FormItem>
        <FormLabel>Precio Máximo *</FormLabel>
        <FormControl>
          <Input
            type="text"
            inputMode="numeric"
            value={maxPriceInput}
            placeholder="$"
            autoComplete="off"
            onChange={handleMaxPriceInput}
            className={cn(
              priceError && "border-destructive focus-visible:ring-destructive"
            )}
          />
        </FormControl>
        {priceError && (
          <p className="text-destructive text-sm font-medium mt-1">
            {priceError}
          </p>
        )}
        <FormMessage />
      </FormItem>
    </div>
  );
};

export default PriceInputFields;
