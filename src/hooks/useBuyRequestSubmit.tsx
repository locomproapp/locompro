
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { BuyRequestFormData } from "./useBuyRequestForm";

export const useBuyRequestSubmit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitBuyRequest = async (formData: BuyRequestFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una solicitud",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
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
        title: formData.title.trim(),
        description: formData.productFeatures?.trim() || null,
        min_price: Number(formData.minPrice) || 0,
        max_price: Number(formData.maxPrice) || 0,
        zone: formData.zone.trim(),
        condition: formData.condition || 'cualquiera',
        reference_url: formData.referenceLink?.trim() || null,
        images: formData.images,
      };

      console.log('💾 Creating buy request with data:', insertData);

      const { data: newRequest, error } = await supabase
        .from("buy_requests")
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
        description: "Solicitud creada correctamente",
      });

      navigate(`/buy-request/${newRequest.id}`);
    } catch (error) {
      console.error("Error creating buy request:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitBuyRequest,
    loading,
  };
};
