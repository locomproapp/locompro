
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { Upload, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  bucketName?: string;
}

const ImageUpload = ({ images, setImages, uploading, setUploading, bucketName = 'offers' }: ImageUploadProps) => {
  const { uploadImages, uploading: hookUploading } = useImageUpload({ 
    bucketName,
    maxFileSize: 5 * 1024 * 1024,
    allowMultiple: true
  });

  // Sincronizar el estado de uploading con el hook
  React.useEffect(() => {
    setUploading(hookUploading);
  }, [hookUploading, setUploading]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls = await uploadImages(files);
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
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
