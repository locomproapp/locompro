
import React, { useState } from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SendOfferFormData } from './SendOfferForm';
import { SendOfferPriceInput } from './SendOfferPriceInput';
import { SendOfferImageUpload } from './SendOfferImageUpload';

interface SendOfferFormFieldsProps {
  control: Control<SendOfferFormData>;
}

export const SendOfferFormFields = ({ control }: SendOfferFormFieldsProps) => {
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

      <SendOfferPriceInput control={control} />

      <FormField
        control={control}
        name="delivery_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Envío</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de envío" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="En persona">En persona</SelectItem>
                <SelectItem value="Por correo">Por correo</SelectItem>
              </SelectContent>
            </Select>
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
      
      <SendOfferImageUpload control={control} />
    </>
  );
};
