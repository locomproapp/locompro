
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, Check, X } from 'lucide-react';
import FilterControls from './FilterControls';
import { useAuth } from '@/hooks/useAuth';

interface TableHeaderProps {
  buyRequestOwnerId?: string;
  statusFilters: {
    pending: boolean;
    accepted: boolean;
    rejected: boolean;
    finalized: boolean;
  };
  conditionFilters: {
    nuevo: boolean;
    'usado-excelente': boolean;
    'usado-bueno': boolean;
    'usado-regular': boolean;
  };
  deliveryFilters: {
    'En persona': boolean;
    'Por correo': boolean;
  };
  sortField: 'price' | 'created_at';
  sortDirection: 'asc' | 'desc';
  onStatusFilterChange: (status: string, checked: boolean) => void;
  onConditionFilterChange: (condition: string, checked: boolean) => void;
  onDeliveryFilterChange: (delivery: string, checked: boolean) => void;
  onSortChange: (field: 'price' | 'created_at', direction: 'asc' | 'desc') => void;
}

const OffersTableHeader = ({
  buyRequestOwnerId,
  statusFilters,
  conditionFilters,
  deliveryFilters,
  sortField,
  sortDirection,
  onStatusFilterChange,
  onConditionFilterChange,
  onDeliveryFilterChange,
  onSortChange
}: TableHeaderProps) => {
  const { user } = useAuth();
  const isBuyRequestOwner = user?.id === buyRequestOwnerId;

  return (
    <TableHeader>
      <TableRow>
        <TableHead>Título</TableHead>
        <TableHead>Precio</TableHead>
        <TableHead>Condición</TableHead>
        <TableHead>Zona</TableHead>
        <TableHead>Envío</TableHead>
        <TableHead>Fecha</TableHead>
        <TableHead>Usuario</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead className="w-16">
          <div className="flex justify-center items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align="end" 
                side="bottom"
                sideOffset={2}
                alignOffset={0}
                avoidCollisions={true}
                collisionBoundary={undefined}
                sticky="partial"
              >
                <FilterControls
                  statusFilters={statusFilters}
                  conditionFilters={conditionFilters}
                  deliveryFilters={deliveryFilters}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onStatusFilterChange={onStatusFilterChange}
                  onConditionFilterChange={onConditionFilterChange}
                  onDeliveryFilterChange={onDeliveryFilterChange}
                  onSortChange={onSortChange}
                />
              </PopoverContent>
            </Popover>
            {/* Show action icons in header for buy request owners */}
            {isBuyRequestOwner && (
              <div className="flex gap-0.5 ml-1">
                <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
                <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                  <X className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
            )}
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OffersTableHeader;
