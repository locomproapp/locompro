
import React, { useState } from 'react';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface OfferImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
}

export const OfferImageUpload = ({ value, onChange, error }: OfferImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadImages, uploading } = useImageUpload({
    bucketName: 'offer-images',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowMultiple: true
  });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - value.length;
    if (files.length > remainingSlots) {
      alert(`Solo puedes subir ${remainingSlots} imagen(es) más`);
      return;
    }

    try {
      const uploadedUrls = await uploadImages(files);
      onChange([...value, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <FormItem>
      <FormLabel>Imágenes del producto * (1-5 imágenes)</FormLabel>
      
      {value.length < 5 && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Arrastra imágenes aquí o haz click para seleccionar
              </p>
              <p className="text-xs text-gray-500">
                Máximo 5MB por imagen • JPG, PNG, WebP, GIF
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  handleFileSelect(target.files);
                };
                input.click();
              }}
            >
              {uploading ? 'Subiendo...' : 'Seleccionar imágenes'}
            </Button>
          </div>
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {value.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500">
        {value.length}/5 imágenes subidas
        {value.length === 0 && <span className="text-red-500"> • Mínimo 1 imagen requerida</span>}
      </div>

      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
