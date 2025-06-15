
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { FormData } from './types';
import { isValidPrice } from './validation';

interface CreatePostFormProps {
  formData: FormData;
  loading: boolean;
  touched: boolean;
  showMaxPriceError: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const CreatePostForm = ({
  formData,
  loading,
  touched,
  showMaxPriceError,
  onInputChange,
  onSubmit,
  onCancel
}: CreatePostFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título del Producto *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="¿Qué estás vendiendo?"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción y Características</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Describe tu producto: características, estado, marca, modelo, etc."
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
            placeholder="$ 0"
            className={
              touched && formData.minPrice !== '' && !isValidPrice(formData.minPrice)
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }
            min="0"
            step="0.01"
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
            placeholder="$ 0"
            className={
              (showMaxPriceError
                ? 'border-destructive focus-visible:ring-destructive'
                : '') +
              ((touched && formData.maxPrice !== '' && !isValidPrice(formData.maxPrice))
                ? ' border-destructive focus-visible:ring-destructive'
                : '')
            }
            min="0"
            step="0.01"
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="referenceLink">Enlace de Referencia</Label>
        <Input
          id="referenceLink"
          type="url"
          value={formData.referenceLink}
          onChange={(e) => onInputChange('referenceLink', e.target.value)}
          placeholder="https://mercadolibre.com.ar/..."
        />
      </div>

      <div>
        <Label htmlFor="zone">Zona *</Label>
        <Input
          id="zone"
          value={formData.zone}
          onChange={(e) => onInputChange('zone', e.target.value)}
          placeholder="Capital Federal, Zona Norte, etc."
          required
        />
      </div>

      <div>
        <Label htmlFor="contactInfo">Datos de Contacto</Label>
        <Textarea
          id="contactInfo"
          value={formData.contactInfo}
          onChange={(e) => onInputChange('contactInfo', e.target.value)}
          placeholder="WhatsApp, email, horarios de contacto, etc."
          rows={2}
        />
      </div>

      <div>
        <Label>Fotos (Opcional)</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Próximamente: Subir imágenes</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Creando...' : 'Crear Publicación'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
