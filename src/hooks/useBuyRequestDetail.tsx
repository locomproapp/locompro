
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useBuyRequestDetail = (id: string) => {
  const query = useQuery({
    queryKey: ['buy-request', id],
    queryFn: async () => {
      console.log('=== CONSULTANDO BUY REQUEST ===');
      console.log('ID buscado:', id);
      
      const { data, error } = await supabase
        .from('buy_requests')
        .select(`
          *,
          categories (name),
          profiles!inner (
            id,
            full_name,
            avatar_url,
            bio,
            location,
            email
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      console.log('=== RESPUESTA DE LA CONSULTA ===');
      console.log('Data recibida:', JSON.stringify(data, null, 2));
      console.log('Error (si hay):', error);
      console.log('=== PROFILE DATA ANALYSIS ===');
      console.log('Profile object:', data?.profiles);
      console.log('Profile full_name:', data?.profiles?.full_name);
      console.log('Profile type:', typeof data?.profiles);
      
      if (error) {
        console.error("Error fetching buy request details:", error);
        throw error;
      }
      
      if (!data) {
        console.warn("No se encontró buy request con ID:", id);
        throw new Error('Buy request not found');
      }
      
      // Validate that profile data exists and has a valid name
      if (!data.profiles || !data.profiles.full_name || data.profiles.full_name.trim() === '') {
        console.error('⚠️ Buy request found but missing valid profile data:', {
          id: data.id,
          user_id: data.user_id,
          profiles: data.profiles
        });
        throw new Error('Buy request profile data is incomplete');
      }
      
      console.log('=== ANÁLISIS DETALLADO DE CAMPOS PROBLEMÁTICOS ===');
      console.log('description:', data.description, '(tipo:', typeof data.description, ')');
      console.log('condition:', data.condition, '(tipo:', typeof data.condition, ')');
      console.log('reference_url:', data.reference_url, '(tipo:', typeof data.reference_url, ')');
      console.log('images array:', data.images, '(tipo:', typeof data.images, ', length:', data.images?.length || 'N/A', ')');
      console.log('reference_image:', data.reference_image, '(tipo:', typeof data.reference_image, ')');
      
      return data;
    },
    enabled: !!id,
    // Forzar revalidación siempre para evitar problemas de cache
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    // Cache muy corto para debugging
    staleTime: 0,
    gcTime: 0,
    // Retry mejorado
    retry: (failureCount, error) => {
      if (failureCount < 3 && error?.message === 'Buy request not found') {
        console.log(`=== RETRY ${failureCount + 1}/3 ===`);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 2000)
  });

  // Efecto para revalidar explícitamente cuando cambia el ID
  useEffect(() => {
    if (id && query.refetch) {
      console.log('=== REVALIDACIÓN POR CAMBIO DE ID ===');
      // Pequeño delay para asegurar que los datos estén propagados
      const timer = setTimeout(() => {
        console.log('=== EJECUTANDO REFETCH ===');
        query.refetch();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [id]);

  return query;
};
