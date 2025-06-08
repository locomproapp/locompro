
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ControllerRenderProps } from 'react-hook-form';

interface PriceInputProps {
  field: ControllerRenderProps<any, 'price'>;
}

const PriceInput = ({ field }: PriceInputProps) => {
  // Función para formatear el precio con separador de miles
  const formatPrice = (value: string): string => {
    // Remover todo lo que no sea número
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (numericValue === '') return '';
    
    // Convertir a número y formatear con separador de miles
    const number = parseInt(numericValue);
    const formatted = number.toLocaleString('es-ES');
    
    return `$ ${formatted}`;
  };

  // Función para extraer el valor numérico del formato
  const parseFormattedPrice = (formattedValue: string): number | undefined => {
    const numericValue = formattedValue.replace(/[^\d]/g, '');
    return numericValue === '' ? undefined : parseInt(numericValue);
  };

  return (
    <FormItem>
      <FormLabel>Precio</FormLabel>
      <FormControl>
        <Input 
          type="text"
          placeholder="Ingresa el precio" 
          value={field.value ? formatPrice(field.value.toString()) : ''}
          onChange={(e) => {
            const rawValue = e.target.value;
            const numericValue = parseFormattedPrice(rawValue);
            field.onChange(numericValue);
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default PriceInput;
