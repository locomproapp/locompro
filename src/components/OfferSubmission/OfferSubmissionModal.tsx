
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
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[280px] sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl max-h-[85vh] overflow-y-auto mx-6 sm:mx-6">
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
