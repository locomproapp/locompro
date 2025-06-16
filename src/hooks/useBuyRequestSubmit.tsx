
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

      const { data: newRequest, error } = await supabase
        .from("buy_requests")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

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
