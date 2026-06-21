import { z } from 'zod';

export const InquiryValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  serviceNeeded: z.string().min(2, 'Please select a required service.'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

export const AdminLoginValidationSchema = z.object({
  email: z.string().email('Please enter a valid admin email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const BlogValidationSchema = z.object({
  title: z.string().min(3, 'Title is too short.'),
  slug: z.string().min(3, 'Slug is too short.'),
  content: z.string().min(10, 'Content must contain markdown details.'),
  excerpt: z.string().min(5, 'Excerpt must be set.'),
  category: z.string().min(2, 'Please provide a category.'),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().min(5, 'Cover image is required.'),
  published: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const ProjectValidationSchema = z.object({
  title: z.string().min(2, 'Title is required.'),
  description: z.string().min(5, 'Description is required.').optional(),
  client: z.string().min(2, 'Client name is required.'),
  category: z.string().min(2, 'Category is required.'),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().min(5, 'Cover image is required.').optional(),
  beforeImage: z.string().optional(),
  afterImage: z.string().optional(),
  projectUrl: z.string().optional(),
  growth: z.string().optional(),
  featured: z.boolean().optional()
});
