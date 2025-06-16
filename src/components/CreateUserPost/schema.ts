
import { z } from 'zod';

export const userPostSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  min_price: z.number().nullable(),
  max_price: z.number().nullable(),
  zone: z.string().min(1, 'La zona es requerida'),
  condition: z.enum(['nuevo', 'usado', 'cualquiera']).default('cualquiera'),
  reference_url: z.string().url('URL inválida').optional().or(z.literal('')),
  images: z.array(z.string()).min(1, 'Debes subir al menos una imagen'),
});

export type UserPostValues = z.infer<typeof userPostSchema>;
