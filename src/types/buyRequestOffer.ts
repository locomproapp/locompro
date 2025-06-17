
export interface BuyRequestOffer {
  id: string;
  buy_request_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[];
  zone: string;
  characteristics: any;
  status: 'pending' | 'accepted' | 'rejected' | 'finalized';
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}
