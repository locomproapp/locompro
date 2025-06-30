import React, { useState } from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SendOfferFormData } from './SendOfferForm';
import { SendOfferPriceInput } from './SendOfferPriceInput';
import { SendOfferImageUpload } from './SendOfferImageUpload';
interface SendOfferFormFieldsProps {
  control: Control<SendOfferFormData>;
}
export const SendOfferFormFields = ({
  control
}: SendOfferFormFieldsProps) => {
  return <>
      <FormField control={control} name="title" render={({
      field
    }) => <FormItem>
            <FormLabel>Título de tu oferta</FormLabel>
            <FormControl>
              <Input placeholder="Ej: iPhone 14 Pro Max 256GB Azul" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />

      <SendOfferPriceInput control={control} />

      <FormField control={control} name="zone" render={({
      field
    }) => <FormItem>
            <FormLabel>Zona</FormLabel>
            <FormControl>
              <Input placeholder="Ej: CABA, Zona Norte, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />

      <FormField control={control} name="condition" render={({
      field
    }) => <FormItem>
            <FormLabel>Estado del producto</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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
          </FormItem>} />

      <FormField control={control} name="delivery_time" render={({
      field
    }) => <FormItem>
            <FormLabel>Envío</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={value => {
          console.log('Delivery time selected:', value);
          field.onChange(value);
        }} value={field.value} className="flex flex-row gap-6">
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
          </FormItem>} />

      <FormField control={control} name="description" render={({
      field
    }) => <FormItem>
            <FormLabel>Descripción adicional (opcional)</FormLabel>
            <FormControl>
              <Textarea placeholder="Información adicional sobre el producto..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />
      
      <SendOfferImageUpload control={control} />
    </>;
};