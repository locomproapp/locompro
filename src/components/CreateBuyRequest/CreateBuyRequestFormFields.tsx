import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { BuyRequestFormData } from "@/hooks/useBuyRequestForm";

// Helper for formatting amounts as "$1.000"
function formatCurrency(value: number) {
  if (Number.isNaN(value)) return "";
  return "$" + value.toLocaleString("es-AR");
}

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
  // Keep slider and input in sync (enforce whole numbers)
  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value.replace(/\D/g, ""));
    val = Math.floor(val);
    onMinPriceChange(clamp(val, MIN, maxPrice));
  };
  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value.replace(/\D/g, ""));
    val = Math.floor(val);
    onMaxPriceChange(clamp(val, minPrice, MAX));
  };

  return (
    <>
      {/* ¿Qué estás buscando? */}
      <div>
        <Label htmlFor="title">¿Qué estás buscando?</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="Ej: Pelota de fútbol, licuadora, auriculares…"
          autoComplete="off"
        />
      </div>

      {/* Condición del producto */}
      <div>
        <Label>Condición del producto</Label>
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

      {/* Presupuesto estimado (slider + min/max formatted input) */}
      <div>
        <Label>Presupuesto estimado</Label>
        <Slider
          min={MIN}
          max={MAX}
          step={STEP}
          value={[
            clamp(minPrice, MIN, maxPrice),
            clamp(maxPrice, minPrice, MAX),
          ]}
          minStepsBetweenThumbs={1}
          onValueChange={([minV, maxV]) => {
            onMinPriceChange(minV);
            onMaxPriceChange(maxV);
          }}
          className="my-4"
        />
        <div className="grid grid-cols-2 gap-4 items-center">
          <div>
            <Label htmlFor="minPrice">Mínimo</Label>
            <Input
              id="minPrice"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={minPrice === 0 ? "" : formatCurrency(minPrice)}
              onChange={handleMinInput}
              placeholder="$"
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Máximo</Label>
            <Input
              id="maxPrice"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={maxPrice === 0 ? "" : formatCurrency(maxPrice)}
              onChange={handleMaxInput}
              placeholder="$"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Características */}
      <div>
        <Label htmlFor="productFeatures">Características</Label>
        <Textarea
          id="productFeatures"
          value={formData.productFeatures || ""}
          onChange={(e) => onInputChange("productFeatures", e.target.value)}
          placeholder="Describí qué estás buscando, con detalles como marca, modelo, color, etc."
          rows={3}
        />
      </div>

      {/* ¿De dónde sos? */}
      <div>
        <Label htmlFor="zone">¿De dónde sos?</Label>
        <Input
          id="zone"
          value={formData.zone}
          onChange={(e) => onInputChange("zone", e.target.value)}
          placeholder="Capital Federal, Zona Norte, etc."
          autoComplete="off"
        />
      </div>
    </>
  );
};

export default CreateBuyRequestFormFields;
