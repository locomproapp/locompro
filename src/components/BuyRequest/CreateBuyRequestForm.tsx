
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import BuyRequestImageUpload from '@/components/BuyRequestDialog/BuyRequestImageUpload';
import { buyRequestSchema, BuyRequestFormData } from './schema';
import { useCreateBuyRequest } from '@/hooks/useCreateBuyRequest';
import { cn } from '@/lib/utils';

interface CreateBuyRequestFormProps {
  onCancel?: () => void;
}

// Currency formatting functions
function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number" || isNaN(value) || value === 0) return "$";
  return (
    "$" +
    value
      .toLocaleString("es-AR", {
        maximumFractionDigits: 0,
        useGrouping: true,
      })
      .replace(/,/g, ".")
  );
}

function parseCurrencyInput(input: string) {
  if (!input || input === "$") return 0;
  const cleaned = input.replace(/\D/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

const CreateBuyRequestForm = ({ onCancel }: CreateBuyRequestFormProps) => {
  const { createBuyRequest, loading } = useCreateBuyRequest();
  const [minPriceInput, setMinPriceInput] = useState("$");
  const [maxPriceInput, setMaxPriceInput] = useState("$");
  const [priceError, setPriceError] = useState<string | null>(null);

  const form = useForm<BuyRequestFormData>({
    resolver: zodResolver(buyRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      min_price: 0,
      max_price: 0,
      zone: '',
      condition: 'cualquiera',
      reference_url: '',
      images: [],
    },
  });

  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseCurrencyInput(e.target.value);
    setMinPriceInput(formatCurrency(value));
    form.setValue('min_price', value);
  };

  const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseCurrencyInput(e.target.value);
    setMaxPriceInput(formatCurrency(value));
    form.setValue('max_price', value);
  };

  // Validation effect
  useEffect(() => {
    const minPrice = parseCurrencyInput(minPriceInput);
    const maxPrice = parseCurrencyInput(maxPriceInput);
    
    if (minPrice > 0 && maxPrice > 0 && minPrice > maxPrice) {
      setPriceError("Introduzca un precio mayor al precio mínimo");
    } else {
      setPriceError(null);
    }
  }, [minPriceInput, maxPriceInput]);

  const onSubmit = async (data: BuyRequestFormData) => {
    if (priceError) return;
    await createBuyRequest(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>¿Qué estás buscando? *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: iPhone 14 Pro Max 256GB" {...field} />
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
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Precio Mínimo *</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                value={minPriceInput}
                placeholder="$"
                autoComplete="off"
                onChange={handleMinPriceInput}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Precio Máximo *</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                value={maxPriceInput}
                placeholder="$"
                autoComplete="off"
                onChange={handleMaxPriceInput}
                className={cn(
                  priceError && "border-destructive focus-visible:ring-destructive"
                )}
              />
            </FormControl>
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
              <FormLabel>Zona *</FormLabel>
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
              <FormLabel>Enlace de referencia (opcional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://ejemplo.com/producto" 
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
              <FormLabel>Fotos de Referencia *</FormLabel>
              <FormControl>
                <BuyRequestImageUpload
                  images={field.value}
                  setImages={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={loading || !!priceError}
          >
            {loading ? 'Creando...' : 'Crear Solicitud'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateBuyRequestForm;
