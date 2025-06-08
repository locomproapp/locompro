
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const offerSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  contact_info: z.object({
    email: z.string().email('Email inválido').optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
  }).optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

interface SendOfferDialogProps {
  buyRequestId: string;
  buyRequestTitle: string;
  onOfferSent?: () => void;
}

const SendOfferDialog = ({ buyRequestId, buyRequestTitle, onOfferSent }: SendOfferDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      contact_info: {
        email: '',
        phone: '',
        whatsapp: '',
      },
    },
  });

  const onSubmit = async (data: OfferFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes estar logueado para enviar una oferta',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from('offers').insert({
        buy_request_id: buyRequestId,
        seller_id: user.id,
        title: data.title,
        description: data.description || null,
        price: data.price,
        contact_info: data.contact_info,
      });

      if (error) throw error;

      toast({
        title: '¡Oferta enviada!',
        description: 'Tu oferta ha sido enviada exitosamente',
      });

      form.reset();
      setOpen(false);
      onOfferSent?.();
    } catch (err) {
      console.error('Error sending offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo enviar la oferta. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Enviar Oferta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Oferta</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Para: "{buyRequestTitle}"
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de tu oferta *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: iPhone 12 Pro usado en excelente estado" {...field} />
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
                  <FormLabel>Precio *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu producto, condición, características especiales..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Información de contacto</FormLabel>
              
              <FormField
                control={form.control}
                name="contact_info.email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_info.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_info.whatsapp"
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

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Enviando...' : 'Enviar Oferta'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SendOfferDialog;
