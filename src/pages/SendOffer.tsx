
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, ZoomIn, ArrowRight, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  delivery_time: z.string().min(1, 'El envío es requerido'),
  images: z.array(z.string()).min(1, 'Debe subir al menos 1 imagen').max(5, 'Máximo 5 imágenes permitidas'),
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
  const [priceDisplayValue, setPriceDisplayValue] = useState('');

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
      delivery_time: '',
      images: [],
    }
  });

  // Price formatting functions
  const formatPriceDisplay = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue === '') return '';
    const number = parseInt(numericValue);
    const formatted = number.toLocaleString('es-AR');
    return `$${formatted}`;
  };

  const parseFormattedPrice = (formattedValue: string): number | undefined => {
    const numericValue = formattedValue.replace(/[^\d]/g, '');
    return numericValue === '' ? undefined : parseInt(numericValue);
  };

  const handlePriceChange = (inputValue: string) => {
    const formatted = formatPriceDisplay(inputValue);
    setPriceDisplayValue(formatted);
    const numericValue = parseFormattedPrice(formatted);
    form.setValue('price', numericValue);
  };

  // Load offer data if it's a counteroffer or edit
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
            delivery_time: offer.delivery_time || '',
            images: offer.images || [],
          });
          
          // Set price display
          setPriceDisplayValue(formatPriceDisplay(offer.price.toString()));
          
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > 5) {
      toast({
        title: "Límite de imágenes",
        description: "Solo podés subir hasta 5 imágenes en total",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('offer-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('offer-images')
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      form.setValue('images', newImages);
      
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
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    form.setValue('images', newImages);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
    form.setValue('images', newImages);
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
            delivery_time: values.delivery_time,
            images: values.images.length > 0 ? values.images : null,
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
            delivery_time: values.delivery_time,
            images: values.images.length > 0 ? values.images : null,
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
            delivery_time: values.delivery_time,
            images: values.images.length > 0 ? values.images : null,
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
                        inputMode="numeric"
                        placeholder="$0"
                        value={priceDisplayValue}
                        onChange={(e) => handlePriceChange(e.target.value)}
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
                    <FormLabel>Envío</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de envío" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En persona">En persona</SelectItem>
                        <SelectItem value="Por correo">Por correo</SelectItem>
                      </SelectContent>
                    </Select>
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
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fotos del producto</FormLabel>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading || images.length >= 5}
                        className="hidden"
                        id="images-upload"
                      />
                      <label htmlFor="images-upload">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploading || images.length >= 5}
                          className="w-full border-dashed cursor-pointer h-20"
                          asChild
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Upload className="h-6 w-6" />
                            <span className="text-sm">
                              {uploading 
                                ? 'Subiendo...' 
                                : images.length >= 5
                                  ? 'Máximo 5 imágenes permitidas'
                                  : `Subir fotos desde dispositivo (${images.length}/5)`}
                            </span>
                          </div>
                        </Button>
                      </label>
                      
                      {images.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center">
                          Tenés que subir al menos una imagen
                        </p>
                      )}
                      
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                                <img 
                                  src={image} 
                                  alt={`Producto ${index + 1}`} 
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                              
                              {/* Action buttons */}
                              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button type="button" size="sm" variant="secondary" className="h-7 w-7 p-0">
                                      <ZoomIn className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <img src={image} alt={`Producto ${index + 1}`} className="w-full h-auto max-h-[80vh] object-contain" />
                                  </DialogContent>
                                </Dialog>
                                
                                <Button type="button" size="sm" variant="destructive" onClick={() => removeImage(index)} className="h-7 w-7 p-0">
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              {/* Reorder buttons */}
                              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button type="button" size="sm" variant="secondary" onClick={() => moveImage(index, 'left')} disabled={index === 0} className="h-7 w-7 p-0">
                                  <ArrowLeftIcon className="h-3 w-3" />
                                </Button>
                                <Button type="button" size="sm" variant="secondary" onClick={() => moveImage(index, 'right')} disabled={index === images.length - 1} className="h-7 w-7 p-0">
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Cover photo indicator */}
                              {index === 0 && (
                                <div className="absolute bottom-2 left-2">
                                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                    Principal
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
