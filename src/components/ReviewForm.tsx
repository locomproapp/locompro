
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  rating: z.number().min(1, 'Selecciona una calificación').max(5, 'La calificación máxima es 5'),
  review_text: z.string().optional()
});

interface ReviewFormProps {
  offerId: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

const ReviewForm = ({ offerId, onReviewSubmitted, onCancel }: ReviewFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      review_text: ''
    }
  });

  const createReviewMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user) throw new Error('User not authenticated');

      // First, get the offer details to know the buyer
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .select('buy_request_id, seller_id')
        .eq('id', offerId)
        .single();

      if (offerError) throw offerError;

      // Get the buy request to find the buyer
      const { data: buyRequest, error: buyRequestError } = await supabase
        .from('buy_requests')
        .select('user_id')
        .eq('id', offer.buy_request_id)
        .single();

      if (buyRequestError) throw buyRequestError;

      // Create the review
      const { error } = await supabase
        .from('reviews')
        .insert({
          offer_id: offerId,
          buyer_id: buyRequest.user_id,
          seller_id: user.id,
          rating: values.rating,
          review_text: values.review_text || null
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "¡Reseña enviada!",
        description: "Tu calificación ha sido registrada exitosamente"
      });
      onReviewSubmitted();
      queryClient.invalidateQueries({ queryKey: ['user-offers'] });
    },
    onError: (error) => {
      console.error('Error creating review:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createReviewMutation.mutate(values);
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue('rating', rating);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold">Calificar al comprador</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calificación</FormLabel>
                <FormControl>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleStarClick(star)}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= (hoverRating || selectedRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="review_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentario (opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Comparte tu experiencia con este comprador..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={createReviewMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createReviewMutation.isPending || selectedRating === 0}
            >
              {createReviewMutation.isPending ? 'Enviando...' : 'Enviar reseña'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReviewForm;
