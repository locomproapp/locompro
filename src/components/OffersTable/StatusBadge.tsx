
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    case 'accepted':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Aceptada</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rechazada</Badge>;
    case 'finalized':
      return <Badge variant="secondary">Finalizada</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export default StatusBadge;
