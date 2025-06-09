
export interface UserOffer {
  id: string;
  buy_request_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  price_history?: Array<{
    price: number;
    timestamp: string;
    type: 'rejected' | 'initial';
  }> | null;
  images: string[] | null;
  contact_info: any;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  buyer_rating?: number | null;
  buy_requests?: {
    title: string;
    zone: string;
    status: string;
  } | null;
}
