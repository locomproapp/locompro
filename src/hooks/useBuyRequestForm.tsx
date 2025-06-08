
import { useState } from 'react';

export interface BuyRequestFormData {
  title: string;
  description: string;
  minPrice: string;
  maxPrice: string;
  zone: string;
  contactInfo: string;
  images: string[];
}

export const useBuyRequestForm = () => {
  const [formData, setFormData] = useState<BuyRequestFormData>({
    title: '',
    description: '',
    minPrice: '',
    maxPrice: '',
    zone: '',
    contactInfo: '',
    images: []
  });

  const handleInputChange = (field: keyof BuyRequestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      minPrice: '',
      maxPrice: '',
      zone: '',
      contactInfo: '',
      images: []
    });
  };

  const setImages = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  return {
    formData,
    handleInputChange,
    resetForm,
    setImages
  };
};
