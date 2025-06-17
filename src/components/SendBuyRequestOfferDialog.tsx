
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
import { Send, Upload, X } from 'lucide-react';

const offerSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  zone: z.string().min(1, 'La zona es requerida'),
  characteristics: z.string().optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

interface SendBuyRequestOfferDialogProps {
  buyRequestId: string;
  buyRequestTitle: string;
  onOfferSent?: () => void;
}

const SendBuyRequestOfferDialog = ({ buyRequestId, buyRequestTitle, onOfferSent }: SendBuyRequestOfferDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      zone: '',
      characteristics: '',
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // Al menos una imagen es obligatoria
    const remainingSlots = 5 - selectedImages.length;
    const newImages = [...selectedImages, ...files.slice(0, remainingSlots)];
    
    setSelectedImages(newImages);

    // Limpiar URLs anteriores para evitar memory leaks
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Crear nuevas URLs de previsualización
    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(newPreviewUrls);

    // Limpiar el input
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    
    // Limpiar URL del objeto para evitar memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return [];

    const uploadPromises = selectedImages.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}_${Date.now()}_${index}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('buy-request-offers')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('buy-request-offers')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: OfferFormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes estar logueado para enviar una oferta',
        variant: 'destructive',
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: 'Error',
        description: 'Debes subir al menos una imagen del producto',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      // Subir imágenes primero
      const imageUrls = await uploadImages();

      // Preparar las características como JSON
      let characteristics = null;
      if (data.characteristics && data.characteristics.trim()) {
        try {
          characteristics = JSON.parse(data.characteristics);
        } catch {
          // Si no es JSON válido, guardarlo como string
          characteristics = { description: data.characteristics };
        }
      }

      const { error } = await supabase.from('buy_request_offers').insert({
        buy_request_id: buyRequestId,
        seller_id: user.id,
        title: data.title,
        description: data.description || null,
        price: data.price,
        zone: data.zone,
        images: imageUrls,
        characteristics,
      });

      if (error) throw error;

      toast({
        title: '¡Oferta enviada!',
        description: 'Tu oferta ha sido enviada exitosamente',
      });

      // Limpiar formulario y estado
      form.reset();
      setSelectedImages([]);
      
      // Limpiar URLs de previsualización
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setImagePreviewUrls([]);
      
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

  // Limpiar URLs cuando el componente se desmonta
  React.useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Palermo, CABA" {...field} />
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

            <FormField
              control={form.control}
              name="characteristics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Características (JSON o texto)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{"color": "azul", "almacenamiento": "256GB"} o descripción libre'
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sección de imágenes */}
            <div className="space-y-2">
              <FormLabel>Imágenes del producto (obligatorio, máximo 5)</FormLabel>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  disabled={selectedImages.length >= 5}
                  className="cursor-pointer"
                />
                {selectedImages.length >= 5 && (
                  <p className="text-sm text-muted-foreground">
                    Has alcanzado el límite máximo de 5 imágenes
                  </p>
                )}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
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

export default SendBuyRequestOfferDialog;
