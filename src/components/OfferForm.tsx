
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  delivery_time: z.string().min(1, 'El tiempo de entrega es requerido'),
  contact_info: z.string().min(5, 'La información de contacto es requerida')
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
      price: 0,
      message: '',
      delivery_time: '',
      contact_info: ''
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
      const { error } = await supabase
        .from('offers')
        .insert({
          buy_request_id: buyRequestId,
          seller_id: user.id,
          title: values.title,
          description: values.description,
          price: values.price,
          message: values.message,
          delivery_time: values.delivery_time,
          contact_info: { info: values.contact_info },
          images: images.length > 0 ? images : null,
          status: 'pending'
        });

      if (error) throw error;

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('offers')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('offers')
          .getPublicUrl(fileName);

        return data.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Imágenes subidas",
        description: "Las imágenes se han subido correctamente"
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "No se pudieron subir las imágenes",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
                  <FormLabel>Precio ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="1000" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
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

            <FormField
              control={form.control}
              name="contact_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Información de contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="WhatsApp, email, teléfono, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Fotos del producto</FormLabel>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="images-upload"
                />
                <label htmlFor="images-upload">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="cursor-pointer"
                    asChild
                  >
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {uploading ? 'Subiendo...' : 'Subir fotos'}
                    </span>
                  </Button>
                </label>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Producto ${index + 1}`} 
                          className="h-20 w-full object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
