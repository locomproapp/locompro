
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
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  min_price: z.number().min(0, 'El precio mínimo debe ser mayor o igual a 0').optional(),
  max_price: z.number().min(0, 'El precio máximo debe ser mayor o igual a 0').optional(),
  zone: z.string().min(1, 'La zona es requerida')
});

interface EditBuyRequestDialogProps {
  buyRequestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const EditBuyRequestDialog = ({ buyRequestId, open, onOpenChange, onUpdate }: EditBuyRequestDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      min_price: undefined,
      max_price: undefined,
      zone: ''
    }
  });

  // Cargar datos existentes cuando se abre el diálogo
  useEffect(() => {
    if (open && buyRequestId) {
      fetchBuyRequest();
    }
  }, [open, buyRequestId]);

  const fetchBuyRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('buy_requests')
        .select('*')
        .eq('id', buyRequestId)
        .single();

      if (error) throw error;

      form.reset({
        title: data.title,
        description: data.description || '',
        min_price: data.min_price || undefined,
        max_price: data.max_price || undefined,
        zone: data.zone
      });
    } catch (error) {
      console.error('Error fetching buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la solicitud",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('buy_requests')
        .update({
          title: values.title,
          description: values.description || null,
          min_price: values.min_price || null,
          max_price: values.max_price || null,
          zone: values.zone,
          updated_at: new Date().toISOString()
        })
        .eq('id', buyRequestId);

      if (error) throw error;

      toast({
        title: "¡Solicitud actualizada!",
        description: "Los cambios han sido guardados exitosamente"
      });

      onOpenChange(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la solicitud",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar solicitud de compra</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormField
                control={form.control}
                name="min_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio mínimo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio máximo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
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
