
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { offerSubmissionSchema, type OfferSubmissionData } from './offerSubmissionSchema';
import { OfferFormFields } from './OfferFormFields';
import { useOfferSubmission } from './useOfferSubmission';

interface OfferSubmissionFormProps {
  buyRequestId: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export const OfferSubmissionForm = ({
  buyRequestId,
  onSubmitSuccess,
  onCancel
}: OfferSubmissionFormProps) => {
  const form = useForm<OfferSubmissionData>({
    resolver: zodResolver(offerSubmissionSchema),
    defaultValues: {
      title: '',
      price: undefined,
      zone: '',
      condition: '',
      description: '',
      delivery_time: '',
      images: [],
    },
  });

  const { submitOffer, isSubmitting } = useOfferSubmission({
    buyRequestId,
    onSuccess: onSubmitSuccess,
  });

  const handleSubmit = (data: OfferSubmissionData) => {
    console.log('Form data being submitted:', data);
    submitOffer(data);
  };

  const watchedValues = form.watch();
  const isFormValid = watchedValues.images && watchedValues.images.length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <OfferFormFields control={form.control} />
        
        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !isFormValid} 
            className="flex-1"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Oferta'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
