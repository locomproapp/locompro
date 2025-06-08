
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Upload, X } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minPrice: '',
    maxPrice: '',
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

    // Validar que se haya subido al menos una imagen
    if (formData.images.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir al menos una imagen de referencia",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('buy_requests')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          min_price: formData.minPrice ? parseFloat(formData.minPrice) : null,
          max_price: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
          zone: formData.zone,
          reference_image: formData.images[0]
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validar archivos antes de subir
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB máximo
      
      if (!isValidType) {
        toast({
          title: "Error",
          description: `${file.name} no es una imagen válida`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "Error",
          description: `${file.name} es demasiado grande (máximo 5MB)`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    console.log('Iniciando subida de', validFiles.length, 'archivos');

    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}-${index}.${fileExt}`;
        
        console.log('Subiendo archivo:', fileName, 'Tamaño:', file.size);
        
        const { data, error: uploadError } = await supabase.storage
          .from('buy-requests')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error en upload:', uploadError);
          throw new Error(`Error subiendo ${file.name}: ${uploadError.message}`);
        }

        console.log('Archivo subido exitosamente:', data);

        const { data: urlData } = supabase.storage
          .from('buy-requests')
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('URLs generadas:', uploadedUrls);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      
      toast({
        title: "Imágenes subidas",
        description: `${uploadedUrls.length} imagen(es) subida(s) correctamente`
      });
    } catch (error) {
      console.error('Error completo en upload:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron subir las imágenes",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Limpiar el input para permitir subir los mismos archivos otra vez
      event.target.value = '';
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
            <Label>Fotos de Referencia *</Label>
            <div className="space-y-3">
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
                  className="w-full border-dashed cursor-pointer"
                  asChild
                >
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Subiendo imágenes...' : 'Subir imágenes desde dispositivo *'}
                  </span>
                </Button>
              </label>
              
              {formData.images.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Debes subir al menos una imagen de referencia
                </p>
              )}
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          console.error('Error cargando imagen:', url);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
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
            <Button 
              type="submit" 
              disabled={loading || uploading || formData.images.length === 0} 
              className="flex-1"
            >
              {loading ? 'Creando...' : 'Crear Solicitud'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBuyRequestDialog;
