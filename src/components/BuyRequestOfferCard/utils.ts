
export const formatPrice = (price: number) => {
  return price.toLocaleString();
};

export const getStatusBadgeProps = (status: string) => {
  switch (status) {
    case 'pending':
      return { variant: 'default' as const, text: 'Pendiente' };
    case 'accepted':
      return { 
        variant: 'secondary' as const, 
        className: 'bg-green-100 text-green-800', 
        text: 'Aceptada' 
      };
    case 'rejected':
      return { variant: 'destructive' as const, text: 'Rechazada' };
    case 'finalized':
      return { variant: 'secondary' as const, text: 'Finalizada' };
    default:
      return { variant: 'outline' as const, text: 'Desconocido' };
  }
};
