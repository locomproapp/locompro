
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const OfferDetailHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>
    </div>
  );
};

export default OfferDetailHeader;
