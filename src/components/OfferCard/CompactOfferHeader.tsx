
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import CompactOfferStatusBadge from './CompactOfferStatusBadge';
import { formatExactDate } from './CompactOfferDateUtils';

interface CompactOfferHeaderProps {
  displayName: string;
  createdAt: string;
  status: string;
  title: string;
}

const CompactOfferHeader = ({ displayName, createdAt, status, title }: CompactOfferHeaderProps) => {
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
        <CompactOfferStatusBadge status={status} />
      </div>
      
      <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
        {title}
      </h3>
    </>
  );
};

export default CompactOfferHeader;
