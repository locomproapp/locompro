
import React from 'react';
import BuyRequestCard from './BuyRequestCard';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number;
  max_price: number;
  reference_image: string | null;
  zone: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

interface BuyRequestGridProps {
  buyRequests: BuyRequest[];
}

const BuyRequestGrid: React.FC<BuyRequestGridProps> = ({ buyRequests }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {buyRequests.map((request) => (
        <BuyRequestCard key={request.id} request={request} />
      ))}
    </div>
  );
};

export default BuyRequestGrid;
