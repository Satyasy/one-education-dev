import { z } from 'zod';

export const editPanjarRealizationItemSchema = z.object({
  panjar_request_id: z.number().min(1, 'Panjar Request ID is required'),
  item_name: z.string().min(1, 'Item name is required'),
  spesification: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  total: z.number().min(0, 'Total must be a positive number'),
  report_status: z.string().optional().default('pending'),
  receipt_file: z.any().optional(),
  item_photo: z.any().optional(),
});

export type EditPanjarRealizationItemFormData = z.infer<typeof editPanjarRealizationItemSchema>;
