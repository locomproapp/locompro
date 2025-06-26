
export const getConditionText = (condition: string) => {
  switch (condition) {
    case 'nuevo': return 'Nuevo';
    case 'usado-excelente': return 'Usado - Excelente estado';
    case 'usado-muy-bueno': return 'Usado - Muy buen estado';
    case 'usado-bueno': return 'Usado - Buen estado';
    case 'usado-regular': return 'Usado - Estado regular';
    case 'refurbished': return 'Reacondicionado';
    case 'para-repuestos': return 'Para repuestos';
    default: return condition;
  }
};
