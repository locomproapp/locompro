
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
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-4">
          Inicia sesión para enviar una oferta
        </p>
        <Button asChild>
          <Link to="/auth">Iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <p className="text-muted-foreground">
        Usa el botón "Enviar Oferta" arriba para hacer tu propuesta.
      </p>
    </div>
  );
};

export default OfferForm;
