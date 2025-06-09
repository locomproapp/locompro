
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, X, AlertTriangle, Clock } from 'lucide-react';

interface OfferStatusProps {
  status: string;
}

const OfferStatus = ({ status }: OfferStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'finalized':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'accepted':
        return 'Aceptada';
      case 'rejected':
        return 'Rechazada';
      case 'withdrawn':
        return 'Retirada';
      case 'finalized':
        return 'No seleccionada';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'accepted':
        return <Check className="h-3 w-3" />;
      case 'rejected':
        return <X className="h-3 w-3" />;
      case 'finalized':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  // Force re-render when status changes by adding timestamp
  console.log('Rendering OfferStatus with status:', status, 'at:', Date.now());

  return (
    <Badge 
      key={`status-${status}-${Date.now()}`}
      className={`${getStatusColor(status)} flex items-center gap-1 mt-1`}
    >
      {getStatusIcon(status)}
      {getStatusText(status)}
    </Badge>
  );
};

export default OfferStatus;
