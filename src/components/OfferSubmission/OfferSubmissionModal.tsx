
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { OfferSubmissionForm } from './OfferSubmissionForm';

interface OfferSubmissionModalProps {
  buyRequestId: string;
  buyRequestTitle: string;
  onOfferSubmitted: () => void;
}

export const OfferSubmissionModal = ({
  buyRequestId,
  buyRequestTitle,
  onOfferSubmitted
}: OfferSubmissionModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmitSuccess = () => {
    setOpen(false);
    // Force page refresh to show the new offer immediately
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <Plus className="h-5 w-5 mr-2" />
          Enviar Oferta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Oferta</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Para: {buyRequestTitle}
          </p>
        </DialogHeader>
        
        <OfferSubmissionForm
          buyRequestId={buyRequestId}
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
