import { z } from 'zod';

// Project validation schemas
export const CreateProjectSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  templateId: z.string().min(1, 'Template ID is required'),
  storeName: z.string().min(1, 'Store name is required').max(100),
  tagline: z.string().max(200).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  themeColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').default('#3B82F6'),
});

export const UpdateProjectSchema = z.object({
  storeName: z.string().min(1).max(100).optional(),
  tagline: z.string().max(200).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().min(1).optional(),
  themeColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  storeConfig: z.string().optional(), // JSON string
});

export const ProjectQuerySchema = z.object({
  userId: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  category: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(10),
  offset: z.coerce.number().int().nonnegative().default(0),
});

// Product validation schemas
export const CreateProductSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  name: z.string().min(1, 'Product name is required').max(200),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  sortOrder: z.number().int().nonnegative().default(0),
});

// Lead validation schemas
export const CreateLeadSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email('Invalid email').optional(),
  message: z.string().max(2000).optional(),
}).refine(
  (data) => data.name || data.phone || data.email,
  {
    message: 'At least one of name, phone, or email must be provided',
  }
);

// File upload validation
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
  }
  
  return { valid: true };
}
