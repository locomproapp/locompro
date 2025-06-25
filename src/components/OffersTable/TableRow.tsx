
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CompactOfferActions from '../OfferCard/CompactOfferActions';
import StatusBadge from './StatusBadge';
import { formatDate, formatPrice, getConditionText, getDeliveryText } from './utils';
import { useAuth } from '@/hooks/useAuth';

interface Offer {
  id: string;
  buy_request_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  contact_info: any;
  status: string;
  rejection_reason: string | null;
  delivery_time: string | null;
  created_at: string;
  updated_at: string;
  buyer_rating?: number | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
  buy_requests?: {
    title: string;
    zone: string;
    status: string;
    user_id?: string;
  } | null;
}

interface OffersTableRowProps {
  offer: Offer;
  buyRequestOwnerId?: string;
  onOfferUpdate?: () => void;
}

const OffersTableRow = ({ offer, buyRequestOwnerId, onOfferUpdate }: OffersTableRowProps) => {
  const { user } = useAuth();
  
  // Determine user permissions
  const isBuyRequestOwner = user?.id === buyRequestOwnerId;
  const canAcceptOrReject = isBuyRequestOwner && offer.status === 'pending';

  return (
    <TableRow key={offer.id}>
      <TableCell>
        <Avatar className="h-8 w-8">
          <AvatarImage src={undefined} alt={offer.profiles?.full_name || 'Usuario'} />
          <AvatarFallback className="text-xs">
            {offer.profiles?.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium max-w-48">
        <div className="truncate" title={offer.title}>
          {offer.title}
        </div>
      </TableCell>
      <TableCell className="font-semibold text-primary">
        ${formatPrice(offer.price)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {getConditionText(offer.contact_info)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {offer.contact_info?.zone || 'No especificada'}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {getDeliveryText(offer.delivery_time, offer.contact_info)}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(offer.created_at)}
      </TableCell>
      <TableCell>
        {offer.profiles?.full_name || 'Usuario anónimo'}
      </TableCell>
      <TableCell>
        <StatusBadge status={offer.status} />
      </TableCell>
      {/* Actions column - only show for buy request owner */}
      {isBuyRequestOwner && (
        <TableCell>
          <CompactOfferActions
            offerId={offer.id}
            canAcceptOrReject={canAcceptOrReject}
            onStatusUpdate={onOfferUpdate}
          />
        </TableCell>
      )}
      <TableCell></TableCell>
    </TableRow>
  );
};

export default OffersTableRow;
