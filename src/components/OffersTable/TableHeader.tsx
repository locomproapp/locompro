
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter } from 'lucide-react';
import FilterControls from './FilterControls';

interface TableHeaderProps {
  isOwner: boolean;
  statusFilters: {
    pending: boolean;
    accepted: boolean;
    rejected: boolean;
    finalized: boolean;
  };
  conditionFilters: {
    nuevo: boolean;
    'usado-excelente': boolean;
    'usado-muy-bueno': boolean;
    'usado-bueno': boolean;
    'usado-regular': boolean;
    refurbished: boolean;
    'para-repuestos': boolean;
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
  isOwner,
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
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12"></TableHead>
        <TableHead>Título</TableHead>
        <TableHead>Precio</TableHead>
        <TableHead>Condición</TableHead>
        <TableHead>Zona</TableHead>
        <TableHead>Envío</TableHead>
        <TableHead>Fecha</TableHead>
        <TableHead>Usuario</TableHead>
        <TableHead>Estado</TableHead>
        {isOwner && <TableHead>Acciones</TableHead>}
        <TableHead className="w-12">
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto" align="end">
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
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OffersTableHeader;
