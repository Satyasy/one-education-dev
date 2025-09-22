import { z } from 'zod';

export const addPanjarRealizationItemSchema = z.object({
  item_name: z.string().min(1, 'Item name is required'),
  spesification: z.string().optional(),
  description: z.string().min(1, 'Item description is required'),
  unit: z.string().min(1, 'Unit is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  price: z.number().min(0.01, 'Unit cost must be greater than 0'),
  total: z.number().min(0.01, 'Total cost must be greater than 0'),
  receipt_file: z.union([
    z.instanceof(File),
    z.string(),
    z.null()
  ]).optional(),
  item_photo: z.union([
    z.instanceof(File), 
    z.string(),
    z.null()
  ]).optional(),
});

export type AddPanjarRealizationItemFormData = z.infer<typeof addPanjarRealizationItemSchema>;
