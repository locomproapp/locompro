
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusBadgeProps } from './utils';

interface OfferHeaderProps {
  profileName: string | null;
  createdAt: string;
  status: string;
}

const OfferHeader = ({ profileName, createdAt, status }: OfferHeaderProps) => {
  const statusProps = getStatusBadgeProps(status);

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={undefined} alt={profileName || 'Usuario'} />
          <AvatarFallback>
            {profileName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-foreground">
            {profileName || 'Usuario anónimo'}
          </h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(createdAt), { 
              addSuffix: true, 
              locale: es 
            })}
          </div>
        </div>
      </div>
      <Badge variant={statusProps.variant} className={statusProps.className}>
        {statusProps.text}
      </Badge>
    </div>
  );
};

export default OfferHeader;
