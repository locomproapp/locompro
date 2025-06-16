
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BuyRequestImageUpload from '@/components/BuyRequestDialog/BuyRequestImageUpload';
import { FormData } from './types';
import { isValidPrice } from './validation';

interface CreatePostFormProps {
  formData: FormData;
  loading: boolean;
  touched: boolean;
  showMaxPriceError: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onImagesChange: (images: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const CreatePostForm = ({
  formData,
  loading,
  touched,
  showMaxPriceError,
  onInputChange,
  onImagesChange,
  onSubmit,
  onCancel
}: CreatePostFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">¿Qué estás buscando? *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Ej: iPhone 14 Pro Max 256GB"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
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
            value={formData.min_price}
            onChange={(e) => {
              onInputChange('min_price', e.target.value.replace(/[^\d.]/g, ''));
            }}
            placeholder="$"
            className={
              touched && formData.min_price !== '' && !isValidPrice(formData.min_price)
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="max_price">Precio Máximo</Label>
          {showMaxPriceError && (
            <div className="text-destructive text-sm mb-1 font-medium">
              El máximo debe ser mayor al mínimo
            </div>
          )}
          <Input
            id="max_price"
            type="text"
            inputMode="numeric"
            value={formData.max_price}
            onChange={(e) => {
              onInputChange('max_price', e.target.value.replace(/[^\d.]/g, ''));
            }}
            placeholder="$"
            className={
              (showMaxPriceError
                ? 'border-destructive focus-visible:ring-destructive'
                : '') +
              ((touched && formData.max_price !== '' && !isValidPrice(formData.max_price))
                ? ' border-destructive focus-visible:ring-destructive'
                : '')
            }
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="zone">Zona *</Label>
        <Input
          id="zone"
          value={formData.zone}
          onChange={(e) => onInputChange('zone', e.target.value)}
          placeholder="Ej: CABA, Zona Norte, etc."
          required
        />
      </div>

      <div>
        <Label>Condición del producto</Label>
        <RadioGroup
          value={formData.condition || 'cualquiera'}
          onValueChange={(value) => onInputChange('condition', value)}
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
          value={formData.reference_url}
          onChange={(e) => onInputChange('reference_url', e.target.value)}
          placeholder="https://ejemplo.com/producto"
        />
      </div>

      <div>
        <Label>Fotos de Referencia *</Label>
        <BuyRequestImageUpload
          images={formData.images}
          setImages={onImagesChange}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || formData.images.length === 0} className="flex-1">
          {loading ? 'Creando...' : 'Crear Publicación'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
