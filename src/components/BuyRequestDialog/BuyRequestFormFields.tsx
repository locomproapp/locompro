
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BuyRequestFormData } from '@/hooks/useBuyRequestForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BuyRequestFormFieldsProps {
  formData: BuyRequestFormData;
  onInputChange: (field: keyof BuyRequestFormData, value: string) => void;
}

const BuyRequestFormFields = ({ formData, onInputChange }: BuyRequestFormFieldsProps) => {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

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
        <Label htmlFor="categoryId">Categoría *</Label>
        <Select value={formData.categoryId} onValueChange={(value) => onInputChange('categoryId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Condición del producto *</Label>
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
