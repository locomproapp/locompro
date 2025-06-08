import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface CreateBuyRequestDialogProps {
  onRequestCreated?: () => void;
}

const CreateBuyRequestDialog = ({ onRequestCreated }: CreateBuyRequestDialogProps) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una solicitud de compra",
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
          characteristics: formData.description ? JSON.parse(`{"description": "${formData.description}"}`) : null,
          contact_info: formData.contactInfo ? JSON.parse(`{"info": "${formData.contactInfo}"}`) : null,
          images: formData.images.length > 0 ? formData.images : null
        });

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Solicitud de compra creada correctamente. ¡Los vendedores podrán enviarte ofertas!"
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
      setOpen(false);
      onRequestCreated?.();
    } catch (error) {
      console.error('Error creating buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud de compra",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          ¿Qué Buscás?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Solicitud de Compra</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">¿Qué estás buscando? *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ej: iPhone 15 Pro Max, Bicicleta de montaña, Silla de oficina..."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción Detallada</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe exactamente qué buscás: características específicas, color, tamaño, marca preferida, estado deseado, etc."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPrice">Presupuesto Mínimo</Label>
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
              <Label htmlFor="maxPrice">Presupuesto Máximo</Label>
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
            <Label htmlFor="referenceLink">Enlace de Referencia (Opcional)</Label>
            <Input
              id="referenceLink"
              type="url"
              value={formData.referenceLink}
              onChange={(e) => handleInputChange('referenceLink', e.target.value)}
              placeholder="https://mercadolibre.com.ar/... (para mostrar ejemplo de lo que buscás)"
            />
          </div>

          <div>
            <Label htmlFor="zone">Zona de Entrega *</Label>
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
              placeholder="WhatsApp, email, horarios preferidos para contacto, etc."
              rows={2}
            />
          </div>

          <div>
            <Label>Fotos de Referencia (Opcional)</Label>
            <div className="space-y-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleImageUrlAdd}
                className="w-full border-dashed"
              >
                <Upload className="h-4 w-4 mr-2" />
                Agregar imagen por URL
              </Button>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creando...' : 'Crear Solicitud'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBuyRequestDialog;
