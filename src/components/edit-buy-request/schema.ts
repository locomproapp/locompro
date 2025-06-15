
import * as z from 'zod';

export const editBuyRequestSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  min_price: z.number().min(0, 'El precio mínimo debe ser mayor o igual a 0').nullable(),
  max_price: z.number().min(0, 'El precio máximo debe ser mayor o igual a 0').nullable(),
  zone: z.string().min(1, 'La zona es requerida'),
  condition: z.string().min(1, 'La condición es requerida'),
  reference_url: z.string().url({ message: "Debe ser una URL válida" }).optional().or(z.literal('')),
  images: z.array(z.string()).min(1, 'Debes subir al menos una imagen.'),
});

export type EditBuyRequestValues = z.infer<typeof editBuyRequestSchema>;
