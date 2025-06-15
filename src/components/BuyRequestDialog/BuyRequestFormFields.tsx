
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BuyRequestFormData } from '@/hooks/useBuyRequestForm';

interface BuyRequestFormFieldsProps {
  formData: BuyRequestFormData;
  onInputChange: (field: keyof BuyRequestFormData, value: string) => void;
}

const BuyRequestFormFields = ({ formData, onInputChange }: BuyRequestFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">¿Qué estás buscando?</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="Ej: Pelota de fútbol, licuadora, auriculares…"
        />
      </div>

      <div>
        <Label>Condición del producto</Label>
        <RadioGroup
          value={formData.condition}
          onValueChange={(value) => onInputChange('condition', value)}
          className="flex gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nuevo" id="nuevo" />
            <Label htmlFor="nuevo">Nuevo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="usado" id="usado" />
            <Label htmlFor="usado">Usado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cualquiera" id="cualquiera" />
            <Label htmlFor="cualquiera">Cualquiera</Label>
          </div>
        </RadioGroup>
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
            step="1"
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
            step="1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="productFeatures">Características</Label>
        <Textarea
          id="productFeatures"
          value={formData.productFeatures || ""}
          onChange={(e) => onInputChange('productFeatures', e.target.value)}
          placeholder="Describí qué estás buscando, con detalles como marca, modelo, color, etc."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="zone">¿De dónde sos?</Label>
        <Input
          id="zone"
          value={formData.zone}
          onChange={(e) => onInputChange('zone', e.target.value)}
          placeholder="Capital Federal, Zona Norte, etc."
        />
      </div>
    </>
  );
};

export default BuyRequestFormFields;
