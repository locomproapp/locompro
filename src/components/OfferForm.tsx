
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ImageUpload from './OfferForm/ImageUpload';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  delivery_time: z.string().min(1, 'El tiempo de entrega es requerido'),
  contact_email: z.string().email('Email inválido').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  contact_whatsapp: z.string().optional(),
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
      delivery_time: '',
      contact_email: '',
      contact_phone: '',
      contact_whatsapp: ''
    }
  });

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue === '') return '';
    const number = parseInt(numericValue);
    const formatted = number.toLocaleString('es-ES');
    return `$ ${formatted}`;
  };

  const parseFormattedPrice = (formattedValue: string): number | undefined => {
    const numericValue = formattedValue.replace(/[^\d]/g, '');
    return numericValue === '' ? undefined : parseInt(numericValue);
  };

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

      // Preparar información de contacto
      const contactInfo = {
        email: values.contact_email || null,
        phone: values.contact_phone || null,
        whatsapp: values.contact_whatsapp || null,
      };

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
          contact_info: contactInfo,
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

      form.reset({
        title: '',
        description: '',
        price: undefined,
        message: '',
        delivery_time: '',
        contact_email: '',
        contact_phone: '',
        contact_whatsapp: ''
      });
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar oferta para: {buyRequestTitle}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de tu oferta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: iPhone 14 Pro Max 256GB Azul" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      placeholder="Ingresa el precio" 
                      value={field.value ? formatPrice(field.value.toString()) : ''}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        const numericValue = parseFormattedPrice(rawValue);
                        field.onChange(numericValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delivery_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiempo de entrega</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 2-3 días, Inmediato, 1 semana" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje al comprador</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe tu producto, estado, incluye detalles que puedan interesar al comprador..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Información de contacto</FormLabel>
              
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email de contacto" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Teléfono de contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="WhatsApp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción adicional (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Información adicional sobre el producto..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
