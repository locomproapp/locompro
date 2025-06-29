
import React from 'react';
import BuyRequestCard from './BuyRequestCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number;
  max_price: number;
  reference_image: string | null;
  zone: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    location: string | null;
    email: string | null;
  } | null;
}

interface BuyRequestGridProps {
  buyRequests: BuyRequest[];
}

const BuyRequestGrid: React.FC<BuyRequestGridProps> = ({ buyRequests }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile 
      ? "grid grid-cols-2 gap-3 w-full px-0" 
      : "flex flex-col gap-0 w-full"
    }>
      {buyRequests.map((request) => (
        <BuyRequestCard 
          key={request.id} 
          request={request} 
          isDesktopHorizontal={!isMobile}
        />
      ))}
    </div>
  );
};

export default BuyRequestGrid;
