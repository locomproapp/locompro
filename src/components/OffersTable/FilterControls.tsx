
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface FilterControlsProps {
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

const FilterControls = ({
  statusFilters,
  conditionFilters,
  deliveryFilters,
  sortField,
  sortDirection,
  onStatusFilterChange,
  onConditionFilterChange,
  onDeliveryFilterChange,
  onSortChange
}: FilterControlsProps) => {
  return (
    <div className="w-72 space-y-4 p-1">
      {/* Sorting Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Ordenar por</h4>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={sortField === 'created_at' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('created_at', sortField === 'created_at' && sortDirection === 'desc' ? 'asc' : 'desc')}
            className="w-full justify-between"
          >
            Fecha
            {sortField === 'created_at' && (
              sortDirection === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant={sortField === 'price' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('price', sortField === 'price' && sortDirection === 'asc' ? 'desc' : 'asc')}
            className="w-full justify-between"
          >
            Precio
            {sortField === 'price' && (
              sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* State Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Estado</h4>
        <div className="space-y-2">
          {Object.entries(statusFilters).map(([status, checked]) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-status-${status}`}
                checked={checked}
                onCheckedChange={(checked) => onStatusFilterChange(status, !!checked)}
              />
              <label htmlFor={`filter-status-${status}`} className="text-sm cursor-pointer">
                {status === 'pending' ? 'Pendiente' : 
                 status === 'accepted' ? 'Aceptada' : 
                 status === 'rejected' ? 'Rechazada' : 'Finalizada'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Condition Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Condición</h4>
        <div className="space-y-2">
          {Object.entries(conditionFilters).map(([condition, checked]) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-condition-${condition}`}
                checked={checked}
                onCheckedChange={(checked) => onConditionFilterChange(condition, !!checked)}
              />
              <label htmlFor={`filter-condition-${condition}`} className="text-sm cursor-pointer">
                {condition === 'nuevo' ? 'Nuevo' :
                 condition === 'usado-excelente' ? 'Usado - Excelente estado' :
                 condition === 'usado-muy-bueno' ? 'Usado - Muy buen estado' :
                 condition === 'usado-bueno' ? 'Usado - Buen estado' :
                 condition === 'usado-regular' ? 'Usado - Estado regular' :
                 condition === 'refurbished' ? 'Reacondicionado' :
                 condition === 'para-repuestos' ? 'Para repuestos' : condition}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Envío</h4>
        <div className="space-y-2">
          {Object.entries(deliveryFilters).map(([delivery, checked]) => (
            <div key={delivery} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-delivery-${delivery}`}
                checked={checked}
                onCheckedChange={(checked) => onDeliveryFilterChange(delivery, !!checked)}
              />
              <label htmlFor={`filter-delivery-${delivery}`} className="text-sm cursor-pointer">
                {delivery}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
