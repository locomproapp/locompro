
/**
 * Capitaliza la primera letra de un texto
 * @param text - El texto a capitalizar
 * @returns El texto con la primera letra en mayúscula
 */
export const capitalizeFirstLetter = (text: string | null | undefined): string => {
  if (!text || typeof text !== 'string') return '';
  
  const trimmedText = text.trim();
  if (trimmedText.length === 0) return '';
  
  return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
};

/**
 * Capitaliza la primera letra de cada oración en un texto
 * @param text - El texto con múltiples oraciones
 * @returns El texto con cada oración capitalizada
 */
export const capitalizeSentences = (text: string | null | undefined): string => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .split('. ')
    .map(sentence => capitalizeFirstLetter(sentence))
    .join('. ');
};
