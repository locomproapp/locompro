
import { useMemo } from 'react';
import { getDeliveryText } from '../utils';

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

interface UseOffersFilteringProps {
  offers: Offer[];
  sortField: 'price' | 'created_at';
  sortDirection: 'asc' | 'desc';
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
}

export const useOffersFiltering = ({
  offers,
  sortField,
  sortDirection,
  statusFilters,
  conditionFilters,
  deliveryFilters
}: UseOffersFilteringProps) => {
  return useMemo(() => {
    let filtered = offers.filter(offer => {
      // Status filter
      if (!statusFilters[offer.status as keyof typeof statusFilters]) {
        return false;
      }
      
      // Condition filter
      const offerCondition = offer.contact_info?.condition || 'nuevo';
      if (!conditionFilters[offerCondition as keyof typeof conditionFilters]) {
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
  }, [offers, sortField, sortDirection, statusFilters, conditionFilters, deliveryFilters]);
};
