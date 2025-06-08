
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useImageUpload } from '@/hooks/useImageUpload';

const CreateBuyRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minPrice: '',
    maxPrice: '',
    zone: '',
    images: [] as string[]
  });

  const { uploadImages, uploading } = useImageUpload({ 
    bucketName: 'buy-requests',
    maxFileSize: 5 * 1024 * 1024,
    allowMultiple: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una solicitud de compra",
        variant: "destructive"
      });
      navigate('/auth');
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
          reference_image: formData.images[0],
          zone: formData.zone
        });

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "Solicitud de compra creada correctamente. ¡Los vendedores podrán enviarte ofertas!"
      });

      navigate('/my-requests');
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
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls = await uploadImages(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Crear Solicitud de Compra
          </h1>
          <p className="text-lg text-muted-foreground">
            Describí exactamente qué estás buscando y recibí ofertas personalizadas de vendedores
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">¿Qué estás buscando? *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ej: iPhone 15 Pro Max, Bicicleta de montaña, Silla de oficina..."
                required
                className="mt-2"
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
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="mt-2"
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
                  className="mt-2"
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
                className="mt-2"
              />
            </div>

            <div>
              <Label>Fotos de Referencia *</Label>
              <div className="space-y-3 mt-2">
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

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" asChild className="flex-1">
                <Link to="/">Cancelar</Link>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateBuyRequest;
