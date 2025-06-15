
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BuyRequestImageUpload from '@/components/BuyRequestDialog/BuyRequestImageUpload';
import { EditBuyRequestValues } from './schema';

interface EditBuyRequestFormProps {
  control: Control<EditBuyRequestValues>;
  minPriceInput: string;
  maxPriceInput: string;
  priceError: string | null;
  handleMinPriceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxPriceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFetching: boolean;
}

export const EditBuyRequestForm = ({
  control,
  minPriceInput,
  maxPriceInput,
  priceError,
  handleMinPriceInput,
  handleMaxPriceInput,
  isFetching,
}: EditBuyRequestFormProps) => {

  if (isFetching) {
    return <div className="text-center p-8 h-96 flex items-center justify-center">Cargando datos...</div>
  }

  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input placeholder="¿Qué estás buscando?" {...field} />
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
            <FormLabel>Descripción (opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe con más detalle lo que buscas..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>Precio mínimo</FormLabel>
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
          <FormLabel>Precio máximo</FormLabel>
          <FormControl>
            <Input
              type="text"
              inputMode="numeric"
              value={maxPriceInput}
              placeholder="$"
              autoComplete="off"
              onChange={handleMaxPriceInput}
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

      <FormField
        control={control}
        name="zone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zona</FormLabel>
            <FormControl>
              <Input placeholder="Ej: CABA, Zona Norte, etc." {...field} />
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
            <FormLabel>Condición del producto</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex gap-6 mt-2"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="nuevo" />
                  </FormControl>
                  <FormLabel className="font-normal">Nuevo</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="usado" />
                  </FormControl>
                  <FormLabel className="font-normal">Usado</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="cualquiera" />
                  </FormControl>
                  <FormLabel className="font-normal">Cualquiera</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reference_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Enlace de referencia <span className="text-muted-foreground font-normal">(opcional)</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="https://ejemplo.com/producto" {...field} value={field.value ?? ''} />
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
            <FormLabel>Fotos de Referencia</FormLabel>
            <FormControl>
              <BuyRequestImageUpload
                images={field.value ?? []}
                setImages={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
