
import { z } from 'zod';

export const offerSubmissionSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  zone: z.string().min(1, 'La zona es requerida'),
  condition: z.string().min(1, 'El estado del producto es requerido'),
  description: z.string().optional(),
  delivery_time: z.string().min(1, 'El método de envío es requerido'),
  images: z.array(z.string()).min(1, 'Debe subir al menos una imagen'),
});

export type OfferSubmissionData = z.infer<typeof offerSubmissionSchema>;
