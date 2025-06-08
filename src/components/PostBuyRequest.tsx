
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  min_price: z.number().min(0, 'El precio mínimo debe ser mayor a 0').optional(),
  max_price: z.number().min(0, 'El precio máximo debe ser mayor a 0').optional(),
  zone: z.string().min(3, 'La zona es requerida'),
  reference_image: z.string().optional()
});

interface PostBuyRequestProps {
  onRequestCreated?: () => void;
}

const PostBuyRequest = ({ onRequestCreated }: PostBuyRequestProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      zone: '',
      reference_image: ''
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para publicar una solicitud",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('buy_requests')
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description,
          category_id: values.category_id,
          min_price: values.min_price,
          max_price: values.max_price,
          zone: values.zone,
          reference_image: values.reference_image
        });

      if (error) throw error;

      toast({
        title: "¡Solicitud publicada!",
        description: "Tu solicitud de compra ha sido publicada exitosamente"
      });

      form.reset();
      setOpen(false);
      onRequestCreated?.();
    } catch (error) {
      console.error('Error creating buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo publicar la solicitud. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('buy-requests')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('buy-requests')
        .getPublicUrl(fileName);

      form.setValue('reference_image', data.publicUrl);
      
      toast({
        title: "Imagen subida",
        description: "La imagen de referencia se ha subido correctamente"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "No se pudo subir la imagen",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <Button disabled className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Iniciar sesión para publicar
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Publicar solicitud de compra
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publicar solicitud de compra</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Qué estás buscando?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: iPhone 14 Pro Max 256GB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio mínimo ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                    <FormLabel>Precio máximo ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1000" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                  <FormLabel>Zona/Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: CABA, Palermo" {...field} />
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
                      placeholder="Describe lo que buscas, características específicas, estado deseado, etc."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Imagen de referencia (opcional)</FormLabel>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="cursor-pointer"
                    asChild
                  >
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {uploading ? 'Subiendo...' : 'Subir imagen'}
                    </span>
                  </Button>
                </label>
                {form.watch('reference_image') && (
                  <img 
                    src={form.watch('reference_image')} 
                    alt="Referencia" 
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Publicar solicitud
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PostBuyRequest;
