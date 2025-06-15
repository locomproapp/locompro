
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

// Validación: ¿es número positivo o vacío?
const isValidPrice = (price: string) => {
  if (price === '' || price === undefined) return false;
  const num = parseFloat(price);
  return !isNaN(num) && num >= 0;
};

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
    contactInfo: '',
    images: [] as string[]
  });

  // Estado para mostrar errores luego de intentar enviar
  const [touched, setTouched] = useState(false);
  // Estado de error específico de precios (por ejemplo, max <= min)
  const [showMaxPriceError, setShowMaxPriceError] = useState(false);

  // Helper: return true if both fields have numbers and max <= min
  const isMaxPriceInvalid = () => {
    const min = parseFloat(formData.minPrice);
    const max = parseFloat(formData.maxPrice);
    return (
      formData.minPrice !== '' &&
      formData.maxPrice !== '' &&
      !isNaN(min) &&
      !isNaN(max) &&
      max <= min
    );
  };

  // Permitir edición completamente libre
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Si el usuario edita los precios, ocultamos el error hasta el próximo intento de submit.
    if (field === 'maxPrice' || field === 'minPrice') {
      setShowMaxPriceError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const priceIsInvalid = isMaxPriceInvalid();
    if (priceIsInvalid) {
      setShowMaxPriceError(true);
    }

    // Validación simple de campos requeridos
    if (!user || !formData.title || !formData.zone) {
      toast({
        title: "Error",
        description: "Completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
    // Si hay error lógico en los precios, no enviar
    if (priceIsInvalid) {
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
          characteristics: formData.description ? JSON.parse(`{"description": "${formData.description}"}`) : null,
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
        contactInfo: '',
        images: []
      });
      setTouched(false);
      setShowMaxPriceError(false);
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

  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) { setTouched(false); setShowMaxPriceError(false); } }}>
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
            <Label htmlFor="title">Título del Producto *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="¿Qué estás vendiendo?"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción y Características</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu producto: características, estado, marca, modelo, etc."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPrice">Precio Mínimo</Label>
              <Input
                id="minPrice"
                type="text"
                inputMode="numeric"
                value={formData.minPrice}
                onChange={(e) => {
                  handleInputChange('minPrice', e.target.value.replace(/[^\d.]/g, ''));
                }}
                placeholder="$ 0"
                className={
                  touched && formData.minPrice !== '' && !isValidPrice(formData.minPrice)
                    ? 'border-destructive focus-visible:ring-destructive'
                    : ''
                }
                min="0"
                step="0.01"
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Precio Máximo</Label>
              {showMaxPriceError && (
                <div className="text-destructive text-sm mb-1 font-medium">
                  El máximo debe ser mayor al mínimo
                </div>
              )}
              <Input
                id="maxPrice"
                type="text"
                inputMode="numeric"
                value={formData.maxPrice}
                onChange={(e) => {
                  handleInputChange('maxPrice', e.target.value.replace(/[^\d.]/g, ''));
                }}
                placeholder="$ 0"
                className={
                  (showMaxPriceError
                    ? 'border-destructive focus-visible:ring-destructive'
                    : '') +
                  ((touched && formData.maxPrice !== '' && !isValidPrice(formData.maxPrice))
                    ? ' border-destructive focus-visible:ring-destructive'
                    : '')
                }
                min="0"
                step="0.01"
                autoComplete="off"
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
