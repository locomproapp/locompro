
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PriceInput } from './PriceInput';
import { OfferImageUpload } from './OfferImageUpload';
import { OfferSubmissionData } from './offerSubmissionSchema';

interface OfferFormFieldsProps {
  control: Control<OfferSubmissionData>;
}

export const OfferFormFields = ({ control }: OfferFormFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título de tu oferta *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ej: iPhone 12 Pro usado en excelente estado" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <PriceInput
            value={field.value}
            onChange={field.onChange}
            error={control.getFieldState('price').error?.message}
          />
        )}
      />

      <FormField
        control={control}
        name="zone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zona *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ej: Capital Federal, Zona Norte, etc." 
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
            <FormLabel>Descripción *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe tu producto, condición, características especiales..."
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="characteristics"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Características *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Información técnica, estado, accesorios incluidos, etc."
                className="resize-none"
                rows={2}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <OfferImageUpload
            value={field.value || []}
            onChange={field.onChange}
            error={control.getFieldState('images').error?.message}
          />
        )}
      />
    </>
  );
};
