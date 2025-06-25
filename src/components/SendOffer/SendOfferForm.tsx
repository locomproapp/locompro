
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SendOfferFormFields } from './SendOfferFormFields';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  delivery_time: z.string().min(1, 'El envío es requerido'),
  images: z.array(z.string()).min(1, 'Debe subir al menos 1 imagen').max(5, 'Máximo 5 imágenes permitidas'),
});

export type SendOfferFormData = z.infer<typeof formSchema>;

interface SendOfferFormProps {
  initialValues?: Partial<SendOfferFormData>;
  onSubmit: (data: SendOfferFormData) => Promise<void>;
  targetBuyRequestId: string;
  isCounterOffer: boolean;
  editOfferId?: string;
}

export const SendOfferForm = ({
  initialValues,
  onSubmit,
  targetBuyRequestId,
  isCounterOffer,
  editOfferId
}: SendOfferFormProps) => {
  const form = useForm<SendOfferFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      price: initialValues?.price || undefined,
      delivery_time: initialValues?.delivery_time || '',
      images: initialValues?.images || [],
    }
  });

  const handleSubmit = async (data: SendOfferFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <SendOfferFormFields control={form.control} />

          <div className="flex gap-4 pt-6">
            <Button type="button" variant="outline" asChild className="flex-1">
              <Link to={`/buy-request/${targetBuyRequestId}`}>Cancelar</Link>
            </Button>
            <Button type="submit" className="flex-1">
              {isCounterOffer ? 'Enviar contraoferta' : editOfferId ? 'Actualizar oferta' : 'Enviar oferta'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
