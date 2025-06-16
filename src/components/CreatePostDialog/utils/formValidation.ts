
import { EditBuyRequestValues } from '@/components/edit-buy-request/schema';

export const cleanFormData = (values: EditBuyRequestValues) => {
  console.log('=== VERIFICACIÓN CAMPO POR CAMPO ===');
  console.log('title:', values.title, '(tipo:', typeof values.title, ')');
  console.log('description (raw):', values.description, '(tipo:', typeof values.description, ', length:', values.description?.length || 0, ')');
  console.log('condition (raw):', values.condition, '(tipo:', typeof values.condition, ')');
  console.log('reference_url (raw):', values.reference_url, '(tipo:', typeof values.reference_url, ', length:', values.reference_url?.length || 0, ')');
  console.log('images (raw):', values.images, '(tipo:', typeof values.images, ', isArray:', Array.isArray(values.images), ', length:', values.images?.length || 0, ')');

  const cleanDescription = values.description && typeof values.description === 'string' && values.description.trim() !== '' 
    ? values.description.trim() 
    : null;
  
  const cleanCondition = values.condition && typeof values.condition === 'string' && values.condition !== '' 
    ? values.condition 
    : null;
  
  const cleanReferenceUrl = values.reference_url && typeof values.reference_url === 'string' && values.reference_url.trim() !== '' 
    ? values.reference_url.trim() 
    : null;
  
  const cleanImages = Array.isArray(values.images) && values.images.length > 0 
    ? values.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
    : null;
  
  const cleanReferenceImage = cleanImages && cleanImages.length > 0 
    ? cleanImages[0] 
    : null;

  console.log('=== DATOS LIMPIOS PROCESADOS ===');
  console.log('cleanDescription:', cleanDescription, '(tipo:', typeof cleanDescription, ')');
  console.log('cleanCondition:', cleanCondition, '(tipo:', typeof cleanCondition, ')');
  console.log('cleanReferenceUrl:', cleanReferenceUrl, '(tipo:', typeof cleanReferenceUrl, ')');
  console.log('cleanImages:', cleanImages, '(tipo:', typeof cleanImages, ', isArray:', Array.isArray(cleanImages), ', length:', cleanImages?.length || 'N/A', ')');
  console.log('cleanReferenceImage:', cleanReferenceImage, '(tipo:', typeof cleanReferenceImage, ')');

  return {
    cleanDescription,
    cleanCondition,
    cleanReferenceUrl,
    cleanImages,
    cleanReferenceImage
  };
};

export const validateFormData = (values: EditBuyRequestValues): string | null => {
  if (!values.images || values.images.length === 0) {
    return "Debes subir al menos una imagen";
  }
  return null;
};
