
import { useState } from "react";

export interface BuyRequestFormData {
  title: string;
  description?: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  zone: string;
  images: string[];
  productFeatures?: string;
  referenceLink?: string;
}

export const useBuyRequestForm = () => {
  const [formData, setFormData] = useState<BuyRequestFormData>({
    title: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    zone: "",
    images: [],
    productFeatures: "",
    referenceLink: "",
  });

  const handleInputChange = (
    field: keyof BuyRequestFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
      zone: "",
      images: [],
      productFeatures: "",
      referenceLink: "",
    });
  };

  const setImages = (images: string[]) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  return {
    formData,
    handleInputChange,
    resetForm,
    setImages,
    setFormData,
  };
};
