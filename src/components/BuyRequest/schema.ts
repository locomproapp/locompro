
import { z } from 'zod';

export const buyRequestSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  min_price: z.number().min(0, 'El precio mínimo debe ser mayor a 0'),
  max_price: z.number().min(0, 'El precio máximo debe ser mayor a 0'),
  zone: z.string().min(1, 'La zona es requerida'),
  condition: z.enum(['nuevo', 'usado', 'cualquiera']),
  reference_url: z.string().url('URL inválida').optional().or(z.literal('')),
  images: z.array(z.string()).min(1, 'Debes subir al menos una imagen'),
}).refine((data) => {
  if (data.max_price < data.min_price) {
    return false;
  }
  return true;
}, {
  message: 'El precio máximo debe ser mayor al mínimo',
  path: ['max_price']
});

export type BuyRequestFormData = z.infer<typeof buyRequestSchema>;
