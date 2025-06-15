
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

interface BuyRequestFormProps {
  from?: "/" | "/marketplace";
}

const BuyRequestForm = ({ from = "/" }: BuyRequestFormProps) => {
  const navigate = useNavigate();
  const {
    formData,
    handleInputChange,
    resetForm,
    setImages,
    setFormData,
  } = useBuyRequestForm();
  const { submitBuyRequest, loading } = useBuyRequestSubmit();

  const parsedMin = Number(formData.minPrice) || 0;
  const parsedMax = Number(formData.maxPrice) || 0;

  const [minPrice, setMinPrice] = useState(parsedMin);
  const [maxPrice, setMaxPrice] = useState(parsedMax);
  const [priceError, setPriceError] = useState(false);

  const handleMinPriceChange = (value: number) => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = (value: number) => {
    setMaxPrice(value);
  };

  React.useEffect(() => {
    if (maxPrice > 0 && maxPrice <= minPrice) {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
  }, [minPrice, maxPrice]);

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    }));
  }, [minPrice, maxPrice, setFormData]);

  React.useEffect(() => {
    setMinPrice(parsedMin);
    setMaxPrice(parsedMax);
  }, []); // on mount, only from formData

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (priceError) {
      return;
    }

    try {
      await submitBuyRequest(formData);
      resetForm();
      navigate("/my-requests");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Spanish back link config:
  const backLinkHref = from === "/marketplace" ? "/marketplace" : "/";
  const backLinkText =
    from === "/marketplace"
      ? "← Volver al mercado"
      : "← Volver al inicio";

  // Cancel should go to previous page based on "from" and reset scroll
  const handleCancel = () => {
    navigate(backLinkHref, { replace: true });
    window.scrollTo(0, 0); // Reset scroll position to top
  };

  return (
    <div className="bg-card rounded-lg border border-border p-8">
      {/* Top small back link in Spanish */}
      <div className="mb-4">
        <Link to={backLinkHref} className="text-sm text-muted-foreground hover:text-primary transition-colors">
          {backLinkText}
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos principales */}
        <CreateBuyRequestFormFields
          formData={formData}
          onInputChange={handleInputChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          priceError={priceError}
        />

        {/* Imagenes (no extra label, just upload) */}
        <div>
          <Label>Fotos de Referencia</Label>
          <BuyRequestImageUpload images={formData.images} setImages={setImages} />
        </div>

        {/* Enlace de Referencia OPCIONAL */}
        <div>
          <Label htmlFor="referenceLink">
            Enlace de referencia <span className="text-muted-foreground font-normal">(opcional)</span>
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
            placeholder="ejemplo.com/producto"
            autoComplete="off"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || formData.images.length === 0 || priceError}
            className="flex-1"
          >
            {loading ? "Creando..." : "Crear Publicación"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuyRequestForm;
