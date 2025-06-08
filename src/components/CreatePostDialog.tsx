
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface CreatePostDialogProps {
  onPostCreated?: () => void;
}

const CreatePostDialog = ({ onPostCreated }: CreatePostDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minPrice: '',
    maxPrice: '',
    referenceLink: '',
    zone: '',
    characteristics: '',
    contactInfo: '',
    images: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una publicación",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          min_price: formData.minPrice ? parseFloat(formData.minPrice) : null,
          max_price: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
          reference_link: formData.referenceLink || null,
          zone: formData.zone,
          characteristics: formData.characteristics ? JSON.parse(`{"description": "${formData.characteristics}"}`) : null,
          contact_info: formData.contactInfo ? JSON.parse(`{"info": "${formData.contactInfo}"}`) : null,
          images: formData.images.length > 0 ? formData.images : null
        });

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Publicación creada correctamente"
      });

      setFormData({
        title: '',
        description: '',
        minPrice: '',
        maxPrice: '',
        referenceLink: '',
        zone: '',
        characteristics: '',
        contactInfo: '',
        images: []
      });
      setOpen(false);
      onPostCreated?.();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la publicación",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Crear Publicación
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Publicación</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="¿Qué estás vendiendo?"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu producto..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPrice">Precio Mínimo</Label>
              <Input
                id="minPrice"
                type="number"
                value={formData.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                placeholder="$ 0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Precio Máximo</Label>
              <Input
                id="maxPrice"
                type="number"
                value={formData.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                placeholder="$ 0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="referenceLink">Enlace de Referencia</Label>
            <Input
              id="referenceLink"
              type="url"
              value={formData.referenceLink}
              onChange={(e) => handleInputChange('referenceLink', e.target.value)}
              placeholder="https://mercadolibre.com.ar/..."
            />
          </div>

          <div>
            <Label htmlFor="zone">Zona *</Label>
            <Input
              id="zone"
              value={formData.zone}
              onChange={(e) => handleInputChange('zone', e.target.value)}
              placeholder="Capital Federal, Zona Norte, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="characteristics">Características del Producto</Label>
            <Textarea
              id="characteristics"
              value={formData.characteristics}
              onChange={(e) => handleInputChange('characteristics', e.target.value)}
              placeholder="Color, marca, modelo, estado, etc."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="contactInfo">Datos de Contacto</Label>
            <Textarea
              id="contactInfo"
              value={formData.contactInfo}
              onChange={(e) => handleInputChange('contactInfo', e.target.value)}
              placeholder="WhatsApp, email, horarios de contacto, etc."
              rows={2}
            />
          </div>

          <div>
            <Label>Fotos (Opcional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Próximamente: Subir imágenes</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creando...' : 'Crear Publicación'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
