
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { BuyRequestFormData } from '@/components/BuyRequest/schema';

export const useCreateBuyRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createBuyRequest = async (data: BuyRequestFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // First, ensure the user profile exists
      console.log('🔍 Checking/creating profile for user:', user.id);
      
      // Check if profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .single();

      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileCheckError);
        throw profileCheckError;
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        console.log('📝 Creating profile for user:', user.id);
        const { error: profileCreateError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
          });

        if (profileCreateError) {
          console.error('Error creating profile:', profileCreateError);
          throw profileCreateError;
        }
      }

      const insertData = {
        user_id: user.id,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        min_price: data.min_price,
        max_price: data.max_price,
        zone: data.zone.trim(),
        condition: data.condition,
        reference_url: data.reference_url?.trim() || null,
        images: data.images,
      };

      console.log('💾 Creating buy request with data:', insertData);
      console.log('👤 User profile info:', { id: user.id, email: user.email, metadata: user.user_metadata });

      const { data: newRequest, error } = await supabase
        .from('buy_requests')
        .insert(insertData)
        .select(`
          *,
          profiles!buy_requests_user_id_fkey (
            full_name,
            avatar_url,
            location
          )
        `)
        .single();

      if (error) {
        console.error('❌ Error creating buy request:', error);
        throw error;
      }

      console.log('✅ Buy request created successfully:', newRequest);
      console.log('👤 Profile data in response:', newRequest.profiles);

      toast({
        title: "¡Éxito!",
        description: "Solicitud creada correctamente"
      });

      navigate(`/buy-request/${newRequest.id}`);
    } catch (error) {
      console.error('Error creating buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createBuyRequest,
    loading
  };
};
