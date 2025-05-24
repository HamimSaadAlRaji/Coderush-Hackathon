import { z } from "zod";

export const ProductRequestSchema = z.object({
  product: z.string().min(1, "Product name is required"),
  condition: z.enum(["new", "used", "refurbished"]),
  usedFor: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
});

export const validateProductRequest = (data: unknown) => {
  return ProductRequestSchema.safeParse(data);
};