import React, { useState, useEffect } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Upload, X, ZoomIn, ArrowRight, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SendOfferFormData } from './SendOfferForm';
interface SendOfferImageUploadProps {
  control: Control<SendOfferFormData>;
}
export const SendOfferImageUpload = ({
  control
}: SendOfferImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const imagesValue = useWatch({
    control,
    name: 'images'
  });

  // Initialize images when form value changes (for edit mode)
  useEffect(() => {
    if (imagesValue && imagesValue.length > 0 && images.length === 0) {
      setImages(imagesValue);
    }
  }, [imagesValue, images.length]);
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > 5) {
      toast({
        title: "Límite de imágenes",
        description: "Solo podés subir hasta 5 imágenes en total",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }
    setUploading(true);
    try {
      const uploadPromises = files.map(async file => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const {
          data,
          error
        } = await supabase.storage.from('offer-images').upload(fileName, file);
        if (error) throw error;
        const {
          data: urlData
        } = supabase.storage.from('offer-images').getPublicUrl(fileName);
        return urlData.publicUrl;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      toast({
        title: "Imágenes subidas",
        description: "Las imágenes se han subido correctamente"
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "No se pudieron subir las imágenes",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };
  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };
  return <FormField control={control} name="images" render={({
    field
  }) => {
    // Update form field when images change
    React.useEffect(() => {
      field.onChange(images);
    }, [images, field]);
    return <FormItem>
            <FormLabel>Fotos</FormLabel>
            <div className="space-y-4">
              <Input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading || images.length >= 5} className="hidden" id="images-upload" />
              <label htmlFor="images-upload">
                <Button type="button" variant="outline" disabled={uploading || images.length >= 5} className="w-full border-dashed cursor-pointer h-20" asChild>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">
                      {uploading ? 'Subiendo...' : images.length >= 5 ? 'Máximo 5 imágenes permitidas' : `Subir fotos desde dispositivo (${images.length}/5)`}
                    </span>
                  </div>
                </Button>
              </label>
              
              {images.length === 0 && <p className="text-sm text-muted-foreground text-center">
                  Tenés que subir al menos una imagen
                </p>}
              
              {images.length > 0 && <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((image, index) => <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                        <img src={image} alt={`Producto ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                      
                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button type="button" size="sm" variant="secondary" className="h-7 w-7 p-0">
                              <ZoomIn className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <img src={image} alt={`Producto ${index + 1}`} className="w-full h-auto max-h-[80vh] object-contain" />
                          </DialogContent>
                        </Dialog>
                        
                        <Button type="button" size="sm" variant="destructive" onClick={() => removeImage(index)} className="h-7 w-7 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Reorder buttons */}
                      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button type="button" size="sm" variant="secondary" onClick={() => moveImage(index, 'left')} disabled={index === 0} className="h-7 w-7 p-0">
                          <ArrowLeftIcon className="h-3 w-3" />
                        </Button>
                        <Button type="button" size="sm" variant="secondary" onClick={() => moveImage(index, 'right')} disabled={index === images.length - 1} className="h-7 w-7 p-0">
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Cover photo indicator */}
                      {index === 0 && <div className="absolute bottom-2 left-2">
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Principal
                          </span>
                        </div>}
                    </div>)}
                </div>}
            </div>
            <FormMessage />
          </FormItem>;
  }} />;
};