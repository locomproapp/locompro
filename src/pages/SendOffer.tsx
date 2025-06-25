
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBuyRequestDetail } from '@/hooks/useBuyRequestDetail';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  delivery_time: z.string().min(1, 'El tiempo de entrega es requerido'),
});

const SendOffer = () => {
  const { id: buyRequestId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const editOfferId = searchParams.get('edit');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isCounterOffer, setIsCounterOffer] = useState(false);
  const [actualBuyRequestId, setActualBuyRequestId] = useState<string | null>(null);

  console.log('🔍 SendOffer - URL buyRequestId:', buyRequestId);
  console.log('🔍 SendOffer - editOfferId:', editOfferId);

  // Get the buy request data
  const { data: buyRequest, isLoading: buyRequestLoading } = useBuyRequestDetail(actualBuyRequestId || buyRequestId || '');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      message: '',
      delivery_time: '',
    }
  });

  // Load offer data if it's a counteroffer
  useEffect(() => {
    const loadOfferData = async () => {
      if (!editOfferId || !user) return;

      try {
        console.log('🔍 Loading offer data for edit:', editOfferId);
        
        const { data: offer, error } = await supabase
          .from('offers')
          .select('*')
          .eq('id', editOfferId)
          .eq('seller_id', user.id)
          .single();

        if (error) {
          console.error('Error loading offer:', error);
          return;
        }

        if (offer) {
          console.log('🔍 Loaded offer data:', offer);
          setIsCounterOffer(offer.status === 'rejected');
          setActualBuyRequestId(offer.buy_request_id);
          
          form.reset({
            title: offer.title,
            description: offer.description || '',
            price: offer.price,
            message: offer.message || '',
            delivery_time: offer.delivery_time || '',
          });
          
          if (offer.images) {
            setImages(offer.images);
          }
        }
      } catch (error) {
        console.error('Error loading offer data:', error);
      }
    };

    loadOfferData();
  }, [editOfferId, user, form]);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('offers')
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('offers')
          .getPublicUrl(fileName);

        return urlData.publicUrl;
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const targetBuyRequestId = actualBuyRequestId || buyRequestId;
    
    if (!user || !targetBuyRequestId) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para enviar una oferta",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Enviando oferta con datos:', values);
      console.log('Target buy request ID:', targetBuyRequestId);

      if (isCounterOffer && editOfferId) {
        // Get current offer data to preserve price history
        const { data: currentOffer, error: fetchError } = await supabase
          .from('offers')
          .select('price, price_history')
          .eq('id', editOfferId)
          .single();

        if (fetchError) {
          console.error('Error fetching current offer:', fetchError);
          throw fetchError;
        }

        // Create price history array
        const existingHistory = currentOffer.price_history as Array<{
          price: number;
          timestamp: string;
          type: 'rejected' | 'initial';
        }> | null;
        
        const priceHistory = existingHistory || [];
        
        // Only add to history if price actually changed
        if (currentOffer.price !== values.price) {
          priceHistory.push({
            price: currentOffer.price,
            timestamp: new Date().toISOString(),
            type: 'rejected'
          });
        }

        // Update offer for counteroffer
        const { error } = await supabase
          .from('offers')
          .update({
            title: values.title,
            description: values.description || null,
            price: values.price,
            message: values.message,
            delivery_time: values.delivery_time,
            images: images.length > 0 ? images : null,
            status: 'pending',
            rejection_reason: null,
            price_history: priceHistory,
            updated_at: new Date().toISOString()
          })
          .eq('id', editOfferId);

        if (error) {
          console.error('Error actualizando oferta:', error);
          throw error;
        }

        toast({
          title: "¡Contraoferta enviada!",
          description: "Tu contraoferta ha sido enviada exitosamente"
        });
      } else if (editOfferId) {
        // Regular edit of pending offer
        const { error } = await supabase
          .from('offers')
          .update({
            title: values.title,
            description: values.description || null,
            price: values.price,
            message: values.message,
            delivery_time: values.delivery_time,
            images: images.length > 0 ? images : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editOfferId);

        if (error) {
          console.error('Error actualizando oferta:', error);
          throw error;
        }

        toast({
          title: "¡Oferta actualizada!",
          description: "Tu oferta ha sido actualizada exitosamente"
        });
      } else {
        // Create new offer
        const { error } = await supabase
          .from('offers')
          .insert({
            buy_request_id: targetBuyRequestId,
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
      }

      navigate(`/buy-request/${targetBuyRequestId}`);
    } catch (error) {
      console.error('Error creating/updating offer:', error);
      toast({
        title: "Error",
        description: `No se pudo ${isCounterOffer ? 'actualizar' : 'enviar'} la oferta. Intenta de nuevo.`,
        variant: "destructive"
      });
    }
  };

  if (buyRequestLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Acceso requerido
            </h1>
            <p className="text-muted-foreground mb-6">
              Debes iniciar sesión para enviar una oferta.
            </p>
            <Button asChild>
              <Link to="/auth">Iniciar sesión</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!buyRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Solicitud no encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              La solicitud que buscas no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link to="/marketplace">Volver al marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const targetBuyRequestId = actualBuyRequestId || buyRequestId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to={`/buy-request/${targetBuyRequestId}`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a la solicitud
            </Link>
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {isCounterOffer ? 'Enviar Contraoferta' : editOfferId ? 'Editar Oferta' : 'Enviar Oferta'}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Para: <span className="font-medium">{buyRequest?.title}</span>
          </p>
          {isCounterOffer && (
            <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded border">
              Estás editando una oferta rechazada. Puedes modificar los datos y reenviarla.
            </p>
          )}
        </div>

        <div className="bg-card rounded-lg border border-border p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
      </main>

      <Footer />
    </div>
  );
};

export default SendOffer;
