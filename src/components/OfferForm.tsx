
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OfferFormProps {
  buyRequestId: string;
  buyRequestTitle: string;
  onOfferCreated?: () => void;
}

const OfferForm = ({ buyRequestId }: OfferFormProps) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Button disabled className="w-full flex items-center gap-2">
        <Send className="h-4 w-4" />
        Iniciar sesión para enviar oferta
      </Button>
    );
  }

  return (
    <Button asChild className="w-full flex items-center gap-2">
      <Link to={`/buy-request/${buyRequestId}/send-offer`}>
        <Send className="h-4 w-4" />
        Enviar oferta
      </Link>
    </Button>
  );
};

export default OfferForm;
