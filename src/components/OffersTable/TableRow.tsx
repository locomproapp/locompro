
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, formatPrice, getConditionText, getDeliveryText } from './utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  // Determine user permissions
  const isBuyRequestOwner = user?.id === buyRequestOwnerId;
  const canAcceptOrReject = isBuyRequestOwner && offer.status === 'pending';

  const handleAccept = async () => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: 'Oferta aceptada',
        description: 'La oferta ha sido aceptada exitosamente',
      });

      onOfferUpdate?.();
    } catch (err) {
      console.error('Error accepting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo aceptar la oferta',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'rejected',
          rejection_reason: 'Rechazada por el comprador'
        })
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: 'Oferta rechazada',
        description: 'La oferta ha sido rechazada',
      });

      onOfferUpdate?.();
    } catch (err) {
      console.error('Error rejecting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo rechazar la oferta',
        variant: 'destructive',
      });
    }
  };

  return (
    <TableRow key={offer.id}>
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
      <TableCell className="w-16">
        <div className="flex justify-center items-center">
          {canAcceptOrReject && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-blue-100"
                onClick={handleAccept}
              >
                <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-red-100"
                onClick={handleReject}
              >
                <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                  <X className="h-2.5 w-2.5 text-white" />
                </div>
              </Button>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OffersTableRow;
