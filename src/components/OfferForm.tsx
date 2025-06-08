
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import FormFields from './OfferForm/FormFields';
import ImageUpload from './OfferForm/ImageUpload';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  delivery_time: z.string().min(1, 'El tiempo de entrega es requerido')
});

interface OfferFormProps {
  buyRequestId: string;
  buyRequestTitle: string;
  onOfferCreated?: () => void;
}

const OfferForm = ({ buyRequestId, buyRequestTitle, onOfferCreated }: OfferFormProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      message: '',
      delivery_time: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para enviar una oferta",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Enviando oferta con datos:', values);
      console.log('Buy request ID:', buyRequestId);
      console.log('User ID:', user.id);

      const { error } = await supabase
        .from('offers')
        .insert({
          buy_request_id: buyRequestId,
          seller_id: user.id,
          title: values.title,
          description: values.description || null,
          price: values.price,
          message: values.message,
          delivery_time: values.delivery_time,
          images: images.length > 0 ? images : null,
          status: 'pending'
        });

      if (error) {
        console.error('Error insertando oferta:', error);
        throw error;
      }

      toast({
        title: "¡Oferta enviada!",
        description: "Tu oferta ha sido enviada exitosamente"
      });

      form.reset();
      setImages([]);
      setOpen(false);
      onOfferCreated?.();
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la oferta. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Button disabled className="w-full flex items-center gap-2">
        <Send className="h-4 w-4" />
        Iniciar sesión para enviar oferta
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center gap-2">
          <Send className="h-4 w-4" />
          Enviar oferta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enviar oferta para: {buyRequestTitle}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFields control={form.control} />
            
            <ImageUpload 
              images={images}
              setImages={setImages}
              uploading={uploading}
              setUploading={setUploading}
            />

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Enviar oferta
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OfferForm;
