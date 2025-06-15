import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BuyRequestImageUpload from './BuyRequestDialog/BuyRequestImageUpload';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  min_price: z.number().min(0, 'El precio mínimo debe ser mayor o igual a 0').nullable(),
  max_price: z.number().min(0, 'El precio máximo debe ser mayor o igual a 0').nullable(),
  zone: z.string().min(1, 'La zona es requerida'),
  condition: z.string().min(1, 'La condición es requerida'),
  reference_url: z.string().url({ message: "Debe ser una URL válida" }).optional().or(z.literal('')),
  images: z.array(z.string()).min(1, 'Debes subir al menos una imagen.'),
});

interface EditBuyRequestDialogProps {
  buyRequestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

// Funciones utilitarias para formateo y parseo
function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number" || isNaN(value) || value === 0) return "";
  return (
    "$" +
    value
      .toLocaleString("es-AR", {
        maximumFractionDigits: 0,
        useGrouping: true,
      })
      .replace(/\./g, ".")
  );
}

function parseCurrencyInput(input: string) {
  if (!input) return null;
  const cleaned = input.replace(/\D/g, "");
  return cleaned ? parseInt(cleaned, 10) : null;
}

const EditBuyRequestDialog = ({ buyRequestId, open, onOpenChange, onUpdate }: EditBuyRequestDialogProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      min_price: null,
      max_price: null,
      zone: '',
      condition: 'cualquiera',
      reference_url: '',
      images: [],
    }
  });

  // Estados locales para mostrar el input formateado
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [priceError, setPriceError] = useState<string | null>(null);

  // Cargar datos existentes cuando se abre el diálogo
  useEffect(() => {
    if (open && buyRequestId) {
      fetchBuyRequest();
    }
    // eslint-disable-next-line
  }, [open, buyRequestId]);

  // Cuando se cargan datos, refrescar inputs
  useEffect(() => {
    const { min_price, max_price } = form.getValues();
    setMinPriceInput(formatCurrency(min_price));
    setMaxPriceInput(formatCurrency(max_price));
  // eslint-disable-next-line
  }, [form.watch('min_price'), form.watch('max_price')]);

  // Validar precios al cambiar
  useEffect(() => {
    const min = parseCurrencyInput(minPriceInput);
    const max = parseCurrencyInput(maxPriceInput);
    if (min !== null && max !== null && max < min) {
      setPriceError('El máximo debe ser mayor al mínimo');
    } else {
      setPriceError(null);
    }
  }, [minPriceInput, maxPriceInput]);

  const fetchBuyRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('buy_requests')
        .select('*')
        .eq('id', buyRequestId)
        .single();

      if (error) throw error;
      
      const allImages = data.images?.length ? data.images : (data.reference_image ? [data.reference_image] : []);

      form.reset({
        title: data.title,
        description: data.description || '',
        min_price: data.min_price || null,
        max_price: data.max_price || null,
        zone: data.zone,
        condition: data.condition || 'cualquiera',
        reference_url: data.reference_url || '',
        images: allImages,
      });
      setMinPriceInput(formatCurrency(data.min_price));
      setMaxPriceInput(formatCurrency(data.max_price));
    } catch (error) {
      console.error('Error fetching buy request:', error);
    }
  };

  // Manejar cambio de inputs y parsear a número en el form
  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinPriceInput(val);
    form.setValue("min_price", parseCurrencyInput(val));
  };
  const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxPriceInput(val);
    form.setValue("max_price", parseCurrencyInput(val));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (priceError) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('buy_requests')
        .update({
          title: values.title,
          description: values.description || null,
          min_price: values.min_price,
          max_price: values.max_price,
          zone: values.zone,
          condition: values.condition,
          reference_url: values.reference_url || null,
          images: values.images,
          reference_image: values.images[0] || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', buyRequestId);

      if (error) throw error;

      onOpenChange(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating buy request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar solicitud de compra</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="¿Qué estás buscando?" {...field} />
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
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe con más detalle lo que buscas..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Precio mínimo */}
              <FormItem>
                <FormLabel>Precio mínimo</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={minPriceInput === "" ? "" : minPriceInput}
                    placeholder="$"
                    autoComplete="off"
                    onChange={handleMinPriceInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              {/* Precio máximo */}
              <FormItem>
                <FormLabel>Precio máximo</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={maxPriceInput === "" ? "" : maxPriceInput}
                    placeholder="$"
                    autoComplete="off"
                    onChange={handleMaxPriceInput}
                  />
                </FormControl>
                {/* Mostrar error solo si corresponde */}
                {priceError && (
                  <p className="text-destructive text-sm font-medium mt-1">
                    {priceError}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: CABA, Zona Norte, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condición del producto</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-6 mt-2"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="nuevo" />
                        </FormControl>
                        <FormLabel className="font-normal">Nuevo</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="usado" />
                        </FormControl>
                        <FormLabel className="font-normal">Usado</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="cualquiera" />
                        </FormControl>
                        <FormLabel className="font-normal">Cualquiera</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Enlace de referencia <span className="text-muted-foreground font-normal">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://ejemplo.com/producto" {...field} value={field.value ?? ''} />
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
                  <FormLabel>Fotos de Referencia</FormLabel>
                  <FormControl>
                    <BuyRequestImageUpload
                      images={field.value ?? []}
                      setImages={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !!priceError}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBuyRequestDialog;
