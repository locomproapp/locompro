
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import BuyRequestImageUpload from '@/components/BuyRequestDialog/BuyRequestImageUpload';
import PriceInputFields from './PriceInputFields';
import { buyRequestSchema, BuyRequestFormData } from './schema';
import { useCreateBuyRequest } from '@/hooks/useCreateBuyRequest';
import { useFormValidation } from './useFormValidation';

interface CreateBuyRequestFormProps {
  onCancel?: () => void;
}

const CreateBuyRequestForm = ({ onCancel }: CreateBuyRequestFormProps) => {
  const { createBuyRequest, loading } = useCreateBuyRequest();

  const form = useForm<BuyRequestFormData>({
    resolver: zodResolver(buyRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      min_price: 0,
      max_price: 0,
      zone: '',
      condition: 'cualquiera',
      reference_url: '',
      images: [],
    },
  });

  const minPrice = form.watch('min_price');
  const maxPrice = form.watch('max_price');
  const { priceError } = useFormValidation(minPrice, maxPrice);

  const onSubmit = async (data: BuyRequestFormData) => {
    if (priceError) return;
    await createBuyRequest(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Qué estás buscando?</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Licuadora, Pelota, Computadora, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describí las carácteristicas de lo que buscás"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PriceInputFields
          minPriceValue={minPrice}
          maxPriceValue={maxPrice}
          onMinPriceChange={(value) => form.setValue('min_price', value)}
          onMaxPriceChange={(value) => form.setValue('max_price', value)}
        />

        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
          name="reference_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enlace de referencia (opcional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://ejemplo.com/producto" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fotos de Referencia</FormLabel>
              <FormControl>
                <BuyRequestImageUpload
                  images={field.value}
                  setImages={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={loading || !!priceError}
          >
            {loading ? 'Creando...' : 'Crear Publicación'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateBuyRequestForm;
