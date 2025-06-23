
import { z } from 'zod';

export const offerSubmissionSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  zone: z.string().min(2, 'La zona debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  characteristics: z.string().optional(),
});

export type OfferSubmissionData = z.infer<typeof offerSubmissionSchema>;
