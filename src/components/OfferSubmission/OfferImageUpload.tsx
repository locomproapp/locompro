
import React, { useState } from 'react';
import { FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, X, ZoomIn, ArrowLeft, ArrowRight } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface OfferImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
}

export const OfferImageUpload = ({ value, onChange, error }: OfferImageUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadImages, uploading } = useImageUpload({
    bucketName: 'offer-images',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowMultiple: true
  });

  const MAX_IMAGES = 5;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (value.length + files.length > MAX_IMAGES) {
      toast({
        title: "Límite de imágenes",
        description: `Solo podés subir hasta ${MAX_IMAGES} imágenes en total`,
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }

    try {
      const uploadedUrls = await uploadImages(files);
      onChange([...value, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      // Clear the input to allow uploading the same files again
      event.target.value = '';
    }
  };

  const handleImageRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...value];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    // Swap elements
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onChange(newImages);
  };

  const canUploadMore = value.length < MAX_IMAGES;

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        accept="image/*" 
        multiple 
        onChange={handleImageUpload} 
        disabled={uploading || !user || !canUploadMore} 
        className="hidden" 
        id="images-upload" 
      />
      <label htmlFor="images-upload">
        <Button 
          type="button" 
          variant="outline" 
          disabled={uploading || !user || !canUploadMore} 
          className="w-full border-dashed cursor-pointer h-20" 
          asChild
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-6 w-6" />
            <span className="text-sm">
              {uploading 
                ? 'Subiendo imágenes...' 
                : !user 
                  ? 'Inicia sesión para subir imágenes' 
                  : !canUploadMore
                    ? `Máximo ${MAX_IMAGES} imágenes permitidas`
                    : `Subir imágenes desde dispositivo (${value.length}/${MAX_IMAGES})`}
            </span>
          </div>
        </Button>
      </label>
      
      {value.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Tenés que subir al menos una imagen
        </p>
      )}
      
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                <img 
                  src={url} 
                  alt={`Referencia ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  onError={(e) => {
                    console.error('Error cargando imagen:', url);
                    e.currentTarget.src = '/placeholder.svg';
                  }} 
                />
              </div>
              
              {/* Botones de acción */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" size="sm" variant="secondary" className="h-7 w-7 p-0">
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <img src={url} alt={`Referencia ${index + 1}`} className="w-full h-auto max-h-[80vh] object-contain" />
                  </DialogContent>
                </Dialog>
                
                <Button type="button" size="sm" variant="destructive" onClick={() => handleImageRemove(index)} className="h-7 w-7 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Botones de reordenar */}
              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button type="button" size="sm" variant="secondary" onClick={() => handleMoveImage(index, 'left')} disabled={index === 0} className="h-7 w-7 p-0">
                   <ArrowLeft className="h-3 w-3" />
                 </Button>
                 <Button type="button" size="sm" variant="secondary" onClick={() => handleMoveImage(index, 'right')} disabled={index === value.length - 1} className="h-7 w-7 p-0">
                   <ArrowRight className="h-3 w-3" />
                 </Button>
              </div>

              {/* Indicador de imagen principal */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2">
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Principal
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
};
