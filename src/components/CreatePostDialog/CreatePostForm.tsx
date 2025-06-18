
import React from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import BuyRequestImageUpload from '@/components/BuyRequestDialog/BuyRequestImageUpload';
import { EditBuyRequestValues } from '@/components/edit-buy-request/schema';
import { useToast } from '@/hooks/use-toast';

function formatCurrency(value: string) {
  if (!value || value === "") return "$";
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, "");
  if (numericValue === "") return "$";
  // Format with thousands separator using dots
  const number = parseInt(numericValue);
  return "$" + number.toLocaleString("es-AR").replace(/,/g, ".");
}

function parseCurrencyInput(input: string) {
  const cleaned = input.replace(/\D/g, "");
  return cleaned ? parseInt(cleaned, 10) : null;
}

interface CreatePostFormProps {
  control: Control<EditBuyRequestValues>;
  minPriceInput: string;
  maxPriceInput: string;
  priceError: string | null;
  handleMinPriceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxPriceInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (values: EditBuyRequestValues) => void;
  onCancel: () => void;
  loading: boolean;
}

const CreatePostForm = ({
  control,
  minPriceInput,
  maxPriceInput,
  priceError,
  handleMinPriceInput,
  handleMaxPriceInput,
  onSubmit,
  onCancel,
  loading,
}: CreatePostFormProps) => {
  const { watch, handleSubmit } = useFormContext<EditBuyRequestValues>();
  const { toast } = useToast();
  const watchedValues = watch();

  const handleFormSubmit = (values: EditBuyRequestValues) => {
    console.log('=== VALORES DEL FORMULARIO ANTES DE ENVIAR ===');
    console.log('Form values:', JSON.stringify(values, null, 2));
    console.log('description:', values.description);
    console.log('condition:', values.condition);
    console.log('reference_url:', values.reference_url);
    console.log('images:', values.images);
    
    if (priceError) {
      toast({
        title: "Error en precios",
        description: priceError,
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormField
        control={control}
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
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción (opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe con más detalle lo que buscas..."
                rows={4}
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  console.log('Description changed to:', e.target.value);
                  field.onChange(e.target.value || '');
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Precio *</FormLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <FormItem>
            <FormLabel>Mínimo</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                value={minPriceInput ? formatCurrency(minPriceInput) : ""}
                placeholder="$"
                autoComplete="off"
                onChange={handleMinPriceInput}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Máximo *</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                value={maxPriceInput ? formatCurrency(maxPriceInput) : ""}
                placeholder="$"
                autoComplete="off"
                onChange={handleMaxPriceInput}
                className={priceError ? 'border-destructive focus-visible:ring-destructive' : ''}
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
      </div>

      <FormField
        control={control}
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
        control={control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condición del producto</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  console.log('Condition changed to:', value);
                  field.onChange(value);
                }}
                value={field.value || 'cualquiera'}
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
        control={control}
        name="reference_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Enlace de referencia <span className="text-muted-foreground font-normal">(opcional)</span>
            </FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Pegá un link de cualquier página que muestre lo que estás buscando
            </div>
            <FormControl>
              <Input 
                placeholder="https://ejemplo.com/producto" 
                {...field} 
                value={field.value || ''} 
                onChange={(e) => {
                  console.log('Reference URL changed to:', e.target.value);
                  field.onChange(e.target.value || '');
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fotos de Referencia *</FormLabel>
            <FormControl>
              <BuyRequestImageUpload
                images={field.value || []}
                setImages={(images) => {
                  console.log('Images changed to:', images);
                  field.onChange(images);
                }}
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
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={loading || !!priceError || !watchedValues.images || watchedValues.images.length === 0}
          className="flex-1"
        >
          {loading ? 'Creando...' : 'Crear Solicitud'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
