
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBuyRequestDetail = (id: string) => {
  return useQuery({
    queryKey: ['buy-request', id],
    queryFn: async () => {
      console.log('=== CONSULTANDO BUY REQUEST ===');
      console.log('ID buscado:', id);
      
      const { data, error } = await supabase
        .from('buy_requests')
        .select(`
          *,
          categories (name),
          profiles (
            full_name,
            avatar_url,
            bio,
            location
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      console.log('=== RESPUESTA DE LA CONSULTA ===');
      console.log('Data recibida:', data);
      console.log('Error (si hay):', error);
      
      if (error) {
        console.error("Error fetching buy request details:", error);
        throw error;
      }
      
      if (!data) {
        console.warn("No se encontró buy request con ID:", id);
        throw new Error('Buy request not found');
      }
      
      console.log('=== DATOS PROCESADOS ===');
      console.log('Título:', data.title);
      console.log('Descripción:', data.description);
      console.log('Condición:', data.condition);
      console.log('Reference URL:', data.reference_url);
      console.log('Images array:', data.images);
      console.log('Reference image:', data.reference_image);
      
      return data;
    },
    enabled: !!id
  });
};
