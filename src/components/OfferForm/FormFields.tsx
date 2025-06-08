
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';
import * as z from 'zod';
import PriceInput from './PriceInput';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  delivery_time: z.string().min(1, 'El tiempo de entrega es requerido')
});

interface FormFieldsProps {
  control: Control<z.infer<typeof formSchema>>;
}

const FormFields = ({ control }: FormFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título de tu oferta</FormLabel>
            <FormControl>
              <Input placeholder="Ej: iPhone 14 Pro Max 256GB Azul" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => <PriceInput field={field} />}
      />

      <FormField
        control={control}
        name="delivery_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tiempo de entrega</FormLabel>
            <FormControl>
              <Input placeholder="Ej: 2-3 días, Inmediato, 1 semana" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mensaje al comprador</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe tu producto, estado, incluye detalles que puedan interesar al comprador..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción adicional (opcional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Información adicional sobre el producto..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FormFields;
