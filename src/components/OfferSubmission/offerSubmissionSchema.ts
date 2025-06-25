
import { z } from 'zod';

export const offerSubmissionSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  zone: z.string().min(1, 'La zona es requerida'),
  condition: z.string().min(1, 'El estado del producto es requerido'),
  delivery_time: z.string().min(1, 'El método de envío es requerido'),
  images: z.array(z.string()).optional(),
});

export type OfferSubmissionData = z.infer<typeof offerSubmissionSchema>;
