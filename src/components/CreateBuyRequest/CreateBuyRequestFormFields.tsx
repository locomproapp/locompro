
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { BuyRequestFormData } from "@/hooks/useBuyRequestForm";

interface CreateBuyRequestFormFieldsProps {
  formData: BuyRequestFormData;
  onInputChange: (field: keyof BuyRequestFormData, value: string) => void;
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}

const MIN = 0;
const MAX = 1000000;
const STEP = 1000;

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

const CreateBuyRequestFormFields = ({
  formData,
  onInputChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: CreateBuyRequestFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">¿Qué estás buscando? *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="Ej: iPhone 15 Pro Max, Bicicleta de montaña, Silla de oficina..."
          required
        />
      </div>

      <div>
        <Label>Condición del producto *</Label>
        <RadioGroup
          value={formData.condition}
          onValueChange={(value) => onInputChange("condition", value)}
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
        <Label>Presupuesto estimado</Label>
        <Slider
          min={MIN}
          max={MAX}
          step={STEP}
          value={[minPrice, maxPrice]}
          onValueChange={([minV, maxV]) => {
            onMinPriceChange(minV);
            onMaxPriceChange(maxV);
          }}
          className="my-4"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minPrice">Mínimo</Label>
            <Input
              id="minPrice"
              type="number"
              min={MIN}
              max={maxPrice}
              step="1"
              value={minPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                onMinPriceChange(clamp(val, MIN, maxPrice));
              }}
              placeholder="$ 0"
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Máximo</Label>
            <Input
              id="maxPrice"
              type="number"
              min={minPrice}
              max={MAX}
              step="1"
              value={maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                onMaxPriceChange(clamp(val, minPrice, MAX));
              }}
              placeholder="$ 0"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="productFeatures">Características del producto</Label>
        <Textarea
          id="productFeatures"
          value={formData.productFeatures || ""}
          onChange={(e) =>
            onInputChange("productFeatures", e.target.value)
          }
          placeholder="Describí qué estás buscando, con detalles como marca, modelo, color, etc."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="zone">¿De dónde sos? *</Label>
        <Input
          id="zone"
          value={formData.zone}
          onChange={(e) => onInputChange("zone", e.target.value)}
          placeholder="Capital Federal, Zona Norte, etc."
          required
        />
      </div>
    </>
  );
};

export default CreateBuyRequestFormFields;
