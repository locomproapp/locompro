import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useBuyRequestForm } from "@/hooks/useBuyRequestForm";
import { useBuyRequestSubmit } from "@/hooks/useBuyRequestSubmit";
import CreateBuyRequestFormFields from "./CreateBuyRequestFormFields";
import BuyRequestImageUpload from "@/components/BuyRequestDialog/BuyRequestImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BuyRequestForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    handleInputChange,
    resetForm,
    setImages,
    setFormData,
  } = useBuyRequestForm();
  const { submitBuyRequest, loading } = useBuyRequestSubmit();

  // Price slider managed as numbers, synced to/from string fields
  const parsedMin = Number(formData.minPrice) || 0;
  const parsedMax = Number(formData.maxPrice) || 100000;

  const [minPrice, setMinPrice] = useState(parsedMin);
  const [maxPrice, setMaxPrice] = useState(parsedMax);

  // Keep formData and slider in sync
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    }));
  }, [minPrice, maxPrice, setFormData]);

  React.useEffect(() => {
    setMinPrice(parsedMin);
    setMaxPrice(parsedMax || Math.max(parsedMin, 100000));
    // eslint-disable-next-line
  }, []); // on mount, only from formData

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitBuyRequest(formData);
      resetForm();
      navigate("/my-requests");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <CreateBuyRequestFormFields
          formData={formData}
          onInputChange={handleInputChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
        />

        {/* Características del producto textarea handled above */}
        {/* Fotos de Referencia (Image upload) */}
        <BuyRequestImageUpload images={formData.images} setImages={setImages} />

        {/* Enlace de referencia */}
        <div>
          <Label htmlFor="referenceLink">
            Enlace de referencia
            <span className="block text-xs text-muted-foreground font-normal mt-0.5">
              Pegá un link de cualquier página que muestre lo que estás buscando
            </span>
          </Label>
          <Input
            id="referenceLink"
            value={formData.referenceLink || ""}
            onChange={(e) =>
              handleInputChange("referenceLink", e.target.value)
            }
            placeholder="https://ejemplo.com/producto"
            autoComplete="off"
          />
        </div>

        <div className="flex gap-4 pt-6">
          <Button type="button" variant="outline" asChild className="flex-1">
            <Link to="/">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={loading || formData.images.length === 0}
            className="flex-1"
          >
            {loading ? "Creando..." : "Crear Solicitud"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuyRequestForm;
