
import { z } from 'zod';

export const offerSubmissionSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  zone: z.string().min(2, 'La zona debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  characteristics: z.string().min(5, 'Las características son obligatorias (mínimo 5 caracteres)'),
  images: z.array(z.string()).min(1, 'Debe subir al menos 1 imagen').max(5, 'Máximo 5 imágenes permitidas'),
});

export type OfferSubmissionData = z.infer<typeof offerSubmissionSchema>;
