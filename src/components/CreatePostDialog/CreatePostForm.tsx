
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BuyRequestImageUpload from '@/components/BuyRequestDialog/BuyRequestImageUpload';
import { EditBuyRequestValues } from '@/components/edit-buy-request/schema';
import { UseFormReturn } from 'react-hook-form';

interface CreatePostFormProps {
  form: UseFormReturn<EditBuyRequestValues>;
  loading: boolean;
  priceError: string | null;
  minPriceInput: string;
  maxPriceInput: string;
  onMinPriceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxPriceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (values: EditBuyRequestValues) => void;
  onCancel: () => void;
  watchedValues: EditBuyRequestValues;
}

const CreatePostForm = ({
  form,
  loading,
  priceError,
  minPriceInput,
  maxPriceInput,
  onMinPriceInput,
  onMaxPriceInput,
  onSubmit,
  onCancel,
  watchedValues
}: CreatePostFormProps) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">¿Qué estás buscando? *</Label>
        <Input
          id="title"
          {...form.register('title')}
          placeholder="Ej: iPhone 14 Pro Max 256GB"
          required
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Describe con más detalle lo que buscas..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_price">Precio Mínimo</Label>
          <Input
            id="min_price"
            type="text"
            inputMode="numeric"
            value={minPriceInput}
            onChange={onMinPriceInput}
            placeholder="$"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="max_price">Precio Máximo</Label>
          {priceError && (
            <div className="text-destructive text-sm mb-1 font-medium">
              {priceError}
            </div>
          )}
          <Input
            id="max_price"
            type="text"
            inputMode="numeric"
            value={maxPriceInput}
            onChange={onMaxPriceInput}
            placeholder="$"
            className={priceError ? 'border-destructive focus-visible:ring-destructive' : ''}
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="zone">Zona *</Label>
        <Input
          id="zone"
          {...form.register('zone')}
          placeholder="Ej: CABA, Zona Norte, etc."
          required
        />
        {form.formState.errors.zone && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.zone.message}</p>
        )}
      </div>

      <div>
        <Label>Condición del producto</Label>
        <RadioGroup
          value={watchedValues.condition}
          onValueChange={(value) => form.setValue('condition', value as any)}
          className="flex gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nuevo" id="nuevo" />
            <Label htmlFor="nuevo" className="font-normal">Nuevo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="usado" id="usado" />
            <Label htmlFor="usado" className="font-normal">Usado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cualquiera" id="cualquiera" />
            <Label htmlFor="cualquiera" className="font-normal">Cualquiera</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="reference_url">
          Enlace de referencia <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Input
          id="reference_url"
          type="url"
          {...form.register('reference_url')}
          placeholder="https://ejemplo.com/producto"
        />
      </div>

      <div>
        <Label>Fotos de Referencia *</Label>
        <BuyRequestImageUpload
          images={watchedValues.images || []}
          setImages={(images) => form.setValue('images', images)}
        />
        {(!watchedValues.images || watchedValues.images.length === 0) && (
          <p className="text-sm text-destructive mt-1">Debes subir al menos una imagen</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading || !watchedValues.images || watchedValues.images.length === 0 || !!priceError} 
          className="flex-1"
        >
          {loading ? 'Creando...' : 'Crear Publicación'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
