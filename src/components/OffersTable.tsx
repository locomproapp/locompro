
import React, { useState, useMemo } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import OffersTableHeader from './OffersTable/TableHeader';
import OffersTableRow from './OffersTable/TableRow';
import { useOffersFiltering } from './OffersTable/hooks/useOffersFiltering';

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
  
  const [conditionFilters, setConditionFilters] = useState({
    nuevo: true,
    'usado-excelente': true,
    'usado-bueno': true,
    'usado-regular': true
  });
  
  const [deliveryFilters, setDeliveryFilters] = useState({
    'En persona': true,
    'Por correo': true
  });

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilters(prev => ({ ...prev, [status]: checked }));
  };

  const handleConditionFilterChange = (condition: string, checked: boolean) => {
    setConditionFilters(prev => ({ ...prev, [condition]: checked }));
  };

  const handleDeliveryFilterChange = (delivery: string, checked: boolean) => {
    setDeliveryFilters(prev => ({ ...prev, [delivery]: checked }));
  };

  // Pre-sort offers by status priority before applying filters
  const statusSortedOffers = useMemo(() => {
    return [...offers].sort((a, b) => {
      // Status priority: accepted > pending > rejected > finalized
      const statusOrder = {
        'accepted': 1,
        'pending': 2,
        'rejected': 3,
        'finalized': 4
      };
      
      const aOrder = statusOrder[a.status as keyof typeof statusOrder] || 5;
      const bOrder = statusOrder[b.status as keyof typeof statusOrder] || 5;
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      // Within same status, sort by creation date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [offers]);

  const filteredAndSortedOffers = useOffersFiltering({
    offers: statusSortedOffers,
    sortField,
    sortDirection,
    statusFilters,
    conditionFilters,
    deliveryFilters
  });

  return (
    <div className="space-y-4 mb-32">
      {/* Table Container */}
      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <OffersTableHeader
              buyRequestOwnerId={buyRequestOwnerId}
              statusFilters={statusFilters}
              conditionFilters={conditionFilters}
              deliveryFilters={deliveryFilters}
              sortField={sortField}
              sortDirection={sortDirection}
              onStatusFilterChange={handleStatusFilterChange}
              onConditionFilterChange={handleConditionFilterChange}
              onDeliveryFilterChange={handleDeliveryFilterChange}
              onSortChange={handleSortChange}
            />
            <TableBody>
              {filteredAndSortedOffers.map((offer) => (
                <OffersTableRow
                  key={offer.id}
                  offer={offer}
                  buyRequestOwnerId={buyRequestOwnerId}
                  onOfferUpdate={onOfferUpdate}
                />
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
