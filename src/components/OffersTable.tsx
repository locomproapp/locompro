
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CompactOfferActions from './OfferCard/CompactOfferActions';
import FilterControls from './OffersTable/FilterControls';

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

interface OffersTableProps {
  offers: Offer[];
  buyRequestOwnerId?: string;
  onOfferUpdate?: () => void;
}

type SortField = 'price' | 'created_at';
type SortDirection = 'asc' | 'desc';

const OffersTable = ({ offers, buyRequestOwnerId, onOfferUpdate }: OffersTableProps) => {
  const { user } = useAuth();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Filter states
  const [statusFilters, setStatusFilters] = useState({
    pending: true,
    accepted: true,
    rejected: true,
    finalized: true
  });
  
  const [deliveryFilters, setDeliveryFilters] = useState({
    'En persona': true,
    'Por correo': true
  });

  const isOwner = user?.id === buyRequestOwnerId;

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilters(prev => ({ ...prev, [status]: checked }));
  };

  const handleDeliveryFilterChange = (delivery: string, checked: boolean) => {
    setDeliveryFilters(prev => ({ ...prev, [delivery]: checked }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month}. ${year} ${hours}:${minutes} hs`;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    }).replace(/,/g, '.');
  };

  const getStatusBadge = (status: string) => {
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

  const getDeliveryText = (delivery: string | null, contactInfo: any) => {
    if (delivery) return delivery;
    return contactInfo?.delivery || 'No especificado';
  };

  const filteredAndSortedOffers = useMemo(() => {
    let filtered = offers.filter(offer => {
      // Status filter
      if (!statusFilters[offer.status as keyof typeof statusFilters]) {
        return false;
      }
      
      // Delivery filter
      const deliveryType = getDeliveryText(offer.delivery_time, offer.contact_info);
      const isPersonal = deliveryType.toLowerCase().includes('persona') || deliveryType === 'En persona';
      const isMail = deliveryType.toLowerCase().includes('correo') || deliveryType === 'Por correo';
      
      if (isPersonal && !deliveryFilters['En persona']) return false;
      if (isMail && !deliveryFilters['Por correo']) return false;
      if (!isPersonal && !isMail && (!deliveryFilters['En persona'] && !deliveryFilters['Por correo'])) return false;
      
      return true;
    });

    // Sort
    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (sortField === 'price') {
        aValue = a.price;
        bValue = b.price;
      } else {
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [offers, sortField, sortDirection, statusFilters, deliveryFilters]);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Envío</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="relative">
                  <div className="flex items-center justify-between">
                    <span>Usuario</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="end">
                        <FilterControls
                          statusFilters={statusFilters}
                          deliveryFilters={deliveryFilters}
                          sortField={sortField}
                          sortDirection={sortDirection}
                          onStatusFilterChange={handleStatusFilterChange}
                          onDeliveryFilterChange={handleDeliveryFilterChange}
                          onSortChange={handleSortChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableHead>
                {isOwner && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedOffers.map((offer) => (
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
                  <TableCell>{getStatusBadge(offer.status)}</TableCell>
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
                  {isOwner && (
                    <TableCell>
                      <CompactOfferActions
                        offerId={offer.id}
                        canAcceptOrReject={isOwner && offer.status === 'pending'}
                        onStatusUpdate={onOfferUpdate}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredAndSortedOffers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron ofertas con los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersTable;
