
export interface ChatMessage {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
}
