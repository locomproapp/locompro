
// Validación: ¿es número positivo o vacío?
export const isValidPrice = (price: string) => {
  if (price === '' || price === undefined) return false;
  const num = parseFloat(price);
  return !isNaN(num) && num >= 0;
};

// Helper: return true if both fields have numbers and max <= min
export const isMaxPriceInvalid = (minPrice: string, maxPrice: string) => {
  const min = parseFloat(minPrice);
  const max = parseFloat(maxPrice);
  return (
    minPrice !== '' &&
    maxPrice !== '' &&
    !isNaN(min) &&
    !isNaN(max) &&
    max <= min
  );
};
