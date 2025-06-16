
import React from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import BuyRequestImageUpload from '@/components/BuyRequestDialog/BuyRequestImageUpload';
import { EditBuyRequestValues } from '@/components/edit-buy-request/schema';

interface CreatePostFormProps {
  control: Control<EditBuyRequestValues>;
  minPriceInput: string;
  maxPriceInput: string;
  priceError: string | null;
  handleMinPriceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxPriceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (values: EditBuyRequestValues) => void;
  onCancel: () => void;
  loading: boolean;
}

const CreatePostForm = ({
  control,
  minPriceInput,
  maxPriceInput,
  priceError,
  handleMinPriceInput,
  handleMaxPriceInput,
  onSubmit,
  onCancel,
  loading,
}: CreatePostFormProps) => {
  const { watch, handleSubmit } = useFormContext<EditBuyRequestValues>();
  const watchedValues = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿Qué estás buscando? *</FormLabel>
            <FormControl>
              <Input placeholder="Ej: iPhone 14 Pro Max 256GB" {...field} />
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
            <FormLabel>Características (opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe con más detalle lo que buscas..."
                rows={4}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem>
          <FormLabel>Precio Mínimo</FormLabel>
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
          <FormLabel>Precio Máximo</FormLabel>
          <FormControl>
            <Input
              type="text"
              inputMode="numeric"
              value={maxPriceInput}
              placeholder="$"
              autoComplete="off"
              onChange={handleMaxPriceInput}
              className={priceError ? 'border-destructive focus-visible:ring-destructive' : ''}
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
            <FormLabel>Zona *</FormLabel>
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
              <Input 
                placeholder="https://ejemplo.com/producto" 
                {...field} 
                value={field.value || ''} 
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
          <FormItem>
            <FormLabel>Fotos de Referencia *</FormLabel>
            <FormControl>
              <BuyRequestImageUpload
                images={field.value || []}
                setImages={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading || !!priceError || !watchedValues.images || watchedValues.images.length === 0}
        >
          {loading ? 'Creando...' : 'Crear Publicación'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
