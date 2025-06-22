
import { useState, useEffect } from 'react';

export const useFormValidation = (minPrice: number, maxPrice: number) => {
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    if (minPrice > 0 && maxPrice > 0 && minPrice > maxPrice) {
      setPriceError("Introduzca un precio mayor al precio mínimo");
    } else {
      setPriceError(null);
    }
  }, [minPrice, maxPrice]);

  return { priceError };
};
