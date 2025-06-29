
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogPortal } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { OfferSubmissionForm } from './OfferSubmissionForm';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

interface OfferSubmissionModalProps {
  buyRequestId: string;
  buyRequestTitle: string;
  onOfferSubmitted?: () => void;
}

export const OfferSubmissionModal = ({ 
  buyRequestId, 
  buyRequestTitle, 
  onOfferSubmitted 
}: OfferSubmissionModalProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleOfferSubmitted = () => {
    setIsOpen(false);
    onOfferSubmitted?.();
  };

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Enviar Oferta
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enviar Oferta</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Para: "{buyRequestTitle}"
            </p>
          </DialogHeader>
          <OfferSubmissionForm
            buyRequestId={buyRequestId}
            onSubmitSuccess={handleOfferSubmitted}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
