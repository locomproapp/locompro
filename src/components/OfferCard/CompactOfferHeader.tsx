
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, X, AlertTriangle, ArrowLeft } from 'lucide-react';

interface CompactOfferHeaderProps {
  displayName: string;
  createdAt: string;
  title: string;
  status: string;
}

const CompactOfferHeader = ({ displayName, createdAt, title, status }: CompactOfferHeaderProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          Pendiente
        </Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-500 flex items-center gap-1 text-xs">
          <Check className="h-3 w-3" />
          Aceptada
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1 text-xs">
          <X className="h-3 w-3" />
          Rechazada
        </Badge>;
      case 'withdrawn':
        return <Badge variant="outline" className="flex items-center gap-1 text-xs">
          <ArrowLeft className="h-3 w-3" />
          Retirada
        </Badge>;
      case 'finalized':
        return <Badge variant="outline" className="flex items-center gap-1 text-xs">
          <AlertTriangle className="h-3 w-3" />
          No seleccionada
        </Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {displayName}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(createdAt)}
          </p>
        </div>
        {getStatusBadge(status)}
      </div>
      
      <h4 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
        {title}
      </h4>
    </div>
  );
};

export default CompactOfferHeader;
