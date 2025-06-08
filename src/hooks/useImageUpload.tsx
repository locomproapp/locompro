
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface UseImageUploadOptions {
  bucketName: string;
  maxFileSize?: number;
  allowMultiple?: boolean;
}

export const useImageUpload = ({ 
  bucketName, 
  maxFileSize = 5 * 1024 * 1024, // 5MB por defecto
  allowMultiple = true 
}: UseImageUploadOptions) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: FileList | File[]): Promise<string[]> => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para subir imágenes",
        variant: "destructive"
      });
      throw new Error("Usuario no autenticado");
    }

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return [];

    // Validar archivos
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= maxFileSize;
      
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
          description: `${file.name} es demasiado grande (máximo ${Math.round(maxFileSize / 1024 / 1024)}MB)`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) {
      throw new Error("No hay archivos válidos para subir");
    }

    setUploading(true);
    console.log(`Iniciando subida de ${validFiles.length} archivos al bucket: ${bucketName}`);

    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${index}.${fileExt}`;
        
        console.log('Subiendo archivo:', fileName, 'Tamaño:', file.size, 'Bucket:', bucketName);
        
        const { data, error: uploadError } = await supabase.storage
          .from(bucketName)
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
          .from(bucketName)
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('URLs generadas:', uploadedUrls);
      
      toast({
        title: "Imágenes subidas",
        description: `${uploadedUrls.length} imagen(es) subida(s) correctamente`
      });

      return uploadedUrls;
    } catch (error) {
      console.error('Error completo en upload:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron subir las imágenes",
        variant: "destructive"
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImages,
    uploading
  };
};
