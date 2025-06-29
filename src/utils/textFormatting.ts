
export const capitalizeFirstLetter = (text: string | null | undefined): string => {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};
