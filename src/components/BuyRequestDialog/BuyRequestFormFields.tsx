
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BuyRequestFormData } from '@/hooks/useBuyRequestForm';

interface BuyRequestFormFieldsProps {
  formData: BuyRequestFormData;
  onInputChange: (field: keyof BuyRequestFormData, value: string) => void;
}

const BuyRequestFormFields = ({ formData, onInputChange }: BuyRequestFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">¿Qué estás buscando? *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Ej: iPhone 15 Pro Max, Bicicleta de montaña, Silla de oficina..."
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción Detallada</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Describe exactamente qué buscás: características específicas, color, tamaño, marca preferida, estado deseado, etc."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minPrice">Presupuesto Mínimo</Label>
          <Input
            id="minPrice"
            type="number"
            value={formData.minPrice}
            onChange={(e) => onInputChange('minPrice', e.target.value)}
            placeholder="$ 0"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="maxPrice">Presupuesto Máximo</Label>
          <Input
            id="maxPrice"
            type="number"
            value={formData.maxPrice}
            onChange={(e) => onInputChange('maxPrice', e.target.value)}
            placeholder="$ 0"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="zone">Zona de Entrega *</Label>
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
          placeholder="WhatsApp, email, horarios preferidos para contacto, etc."
          rows={2}
        />
      </div>
    </>
  );
};

export default BuyRequestFormFields;
