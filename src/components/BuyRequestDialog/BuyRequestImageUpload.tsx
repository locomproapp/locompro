
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuth } from '@/hooks/useAuth';

interface BuyRequestImageUploadProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const BuyRequestImageUpload = ({ images, setImages }: BuyRequestImageUploadProps) => {
  const { user } = useAuth();
  const { uploadImages, uploading } = useImageUpload({ 
    bucketName: 'buy-requests',
    maxFileSize: 5 * 1024 * 1024,
    allowMultiple: true
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls = await uploadImages(files);
      setImages([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      // Limpiar el input para permitir subir los mismos archivos otra vez
      event.target.value = '';
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label>Fotos de Referencia *</Label>
      <div className="space-y-3">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={uploading || !user}
          className="hidden"
          id="images-upload"
        />
        <label htmlFor="images-upload">
          <Button 
            type="button" 
            variant="outline" 
            disabled={uploading || !user}
            className="w-full border-dashed cursor-pointer"
            asChild
          >
            <span className="flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? 'Subiendo imágenes...' : !user ? 'Inicia sesión para subir imágenes' : 'Subir imágenes desde dispositivo *'}
            </span>
          </Button>
        </label>
        
        {images.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Debes subir al menos una imagen de referencia
          </p>
        )}
        
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((url, index) => (
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
  );
};

export default BuyRequestImageUpload;
