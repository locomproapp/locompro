
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageUpload = ({ images, setImages, uploading, setUploading }: ImageUploadProps) => {
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
        const fileName = `offer-${Date.now()}-${index}.${fileExt}`;
        
        console.log('Subiendo archivo:', fileName, 'Tamaño:', file.size);
        
        const { data, error: uploadError } = await supabase.storage
          .from('offers')
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
          .from('offers')
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('URLs generadas:', uploadedUrls);
      
      setImages(prev => [...prev, ...uploadedUrls]);
      
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

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <FormLabel>Fotos del producto</FormLabel>
      <div className="space-y-4">
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
            className="cursor-pointer w-full"
            asChild
          >
            <span className="flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? 'Subiendo...' : 'Subir fotos desde dispositivo'}
            </span>
          </Button>
        </label>
        
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image} 
                  alt={`Producto ${index + 1}`} 
                  className="h-20 w-full object-cover rounded"
                  onError={(e) => {
                    console.error('Error cargando imagen:', image);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
