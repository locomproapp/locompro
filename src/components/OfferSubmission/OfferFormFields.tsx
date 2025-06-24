
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PriceInput } from './PriceInput';
import { OfferImageUpload } from './OfferImageUpload';
import { OfferSubmissionData } from './offerSubmissionSchema';

interface OfferFormFieldsProps {
  control: Control<OfferSubmissionData>;
}

export const OfferFormFields = ({ control }: OfferFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe tu producto, condición, características especiales..." 
                className="resize-none" 
                rows={4} 
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
            <FormLabel>Zona</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ej: CABA, Zona Norte, etc." 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado del producto</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="nuevo">Nuevo</SelectItem>
                <SelectItem value="usado-excelente">Usado - Excelente estado</SelectItem>
                <SelectItem value="usado-muy-bueno">Usado - Muy buen estado</SelectItem>
                <SelectItem value="usado-bueno">Usado - Buen estado</SelectItem>
                <SelectItem value="usado-regular">Usado - Estado regular</SelectItem>
                <SelectItem value="refurbished">Reacondicionado</SelectItem>
                <SelectItem value="para-repuestos">Para repuestos</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imágenes</FormLabel>
            <FormControl>
              <OfferImageUpload 
                value={field.value || []} 
                onChange={field.onChange} 
                error={control.getFieldState('images').error?.message} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
