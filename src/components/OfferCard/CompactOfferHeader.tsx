
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';

interface CompactOfferHeaderProps {
  displayName: string;
  createdAt: string;
  title: string;
  status: string;
}

const CompactOfferHeader = ({ displayName, createdAt, title, status }: CompactOfferHeaderProps) => {
  const formatExactDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month}. ${year} ${hours}:${minutes} hs`;
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aceptada</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>;
      case 'finalized':
        return <Badge variant="outline" className="bg-gray-100 text-gray-600">Finalizada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} alt={displayName || 'Usuario'} />
            <AvatarFallback className="text-xs">
              {displayName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm text-foreground">
              {displayName || 'Usuario anónimo'}
            </h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatExactDate(createdAt)}
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>
      
      <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
        {title}
      </h3>
    </>
  );
};

export default CompactOfferHeader;
