
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
  const currentImages = Array.isArray(formData.images) ? formData.images : [];

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
          <Label htmlFor="minPrice">Precio Mínimo</Label>
          <Input
            id="minPrice"
            type="text"
            inputMode="numeric"
            value={formData.minPrice}
            onChange={(e) => {
              onInputChange('minPrice', e.target.value.replace(/[^\d.]/g, ''));
            }}
            placeholder="$"
            className={
              touched && formData.minPrice !== '' && !isValidPrice(formData.minPrice)
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="maxPrice">Precio Máximo</Label>
          {showMaxPriceError && (
            <div className="text-destructive text-sm mb-1 font-medium">
              El máximo debe ser mayor al mínimo
            </div>
          )}
          <Input
            id="maxPrice"
            type="text"
            inputMode="numeric"
            value={formData.maxPrice}
            onChange={(e) => {
              onInputChange('maxPrice', e.target.value.replace(/[^\d.]/g, ''));
            }}
            placeholder="$"
            className={
              (showMaxPriceError
                ? 'border-destructive focus-visible:ring-destructive'
                : '') +
              ((touched && formData.maxPrice !== '' && !isValidPrice(formData.maxPrice))
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
          value={formData.contactInfo || 'cualquiera'}
          onValueChange={(value) => onInputChange('contactInfo', value)}
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
        <Label htmlFor="referenceLink">
          Enlace de referencia <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Input
          id="referenceLink"
          type="url"
          value={formData.referenceLink}
          onChange={(e) => onInputChange('referenceLink', e.target.value)}
          placeholder="https://ejemplo.com/producto"
        />
      </div>

      <div>
        <Label>Fotos de Referencia *</Label>
        <BuyRequestImageUpload
          images={currentImages}
          setImages={onImagesChange}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || currentImages.length === 0} className="flex-1">
          {loading ? 'Creando...' : 'Crear Publicación'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
