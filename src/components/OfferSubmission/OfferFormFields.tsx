
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
                placeholder="Ej: Licuadora Marca..." 
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
                placeholder="Describí tu producto, sus especificaciones, aclaraciones al comprador..." 
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
                <SelectItem value="usado-bueno">Usado - Buen estado</SelectItem>
                <SelectItem value="usado-regular">Usado - Estado regular</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="delivery_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Envío</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-row space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="En persona" id="en-persona" />
                  <label htmlFor="en-persona" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    En persona
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Por correo" id="por-correo" />
                  <label htmlFor="por-correo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Por correo
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
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
