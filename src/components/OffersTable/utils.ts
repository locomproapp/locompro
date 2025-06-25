
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day} ${month}. ${year} ${hours}:${minutes} hs`;
};

export const formatPrice = (price: number) => {
  return price.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  }).replace(/,/g, '.');
};

export const getConditionText = (contactInfo: any) => {
  if (!contactInfo?.condition) return 'No especificada';
  
  switch (contactInfo.condition) {
    case 'nuevo': return 'Nuevo';
    case 'usado-excelente': return 'Usado - Excelente estado';
    case 'usado-muy-bueno': return 'Usado - Muy buen estado';
    case 'usado-bueno': return 'Usado - Buen estado';
    case 'usado-regular': return 'Usado - Estado regular';
    case 'refurbished': return 'Reacondicionado';
    case 'para-repuestos': return 'Para repuestos';
    default: return contactInfo.condition;
  }
};

export const getDeliveryText = (delivery: string | null, contactInfo: any) => {
  if (delivery) return delivery;
  return contactInfo?.delivery || 'No especificado';
};
