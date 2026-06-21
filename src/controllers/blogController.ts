import { Request, Response } from 'express';
import { Blog } from '../models/Blog';
import { BlogValidationSchema } from '../validators/schema';
import { StorageService } from '../services/storageService';

export const createBlog = async (req: Request, res: Response) => {
  try {
    const validated = BlogValidationSchema.parse(req.body);
    
    // Auto-generate slug if it contains spaces or needs normalization
    const slug = validated.slug.replace(/\s+/g, '-').toLowerCase();
    
    // Check if slug is already taken
    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'Blog slug must be unique. This slug is already taken.' });
    }

    const blog = await Blog.create({ ...validated, slug });
    res.status(201).json({ success: true, data: blog });
  } catch (error: any) {
    res.status(400).json({ error: error.errors ? error.errors[0].message : error.message });
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    // Allow non-admin visitors to only retrieve published blogs
    if (req.query.published === 'true') {
      filter.published = true;
    }
    
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }
    res.json({ success: true, data: blog });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = BlogValidationSchema.parse(req.body);
    
    const slug = validated.slug.replace(/\s+/g, '-').toLowerCase();
    const existing = await Blog.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return res.status(400).json({ error: 'Blog slug is already taken by another post.' });
    }

    const blog = await Blog.findByIdAndUpdate(id, { ...validated, slug }, { new: true });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    res.json({ success: true, data: blog });
  } catch (error: any) {
    res.status(400).json({ error: error.errors ? error.errors[0].message : error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    
    // Clean up cover image if it was hosted locally
    await StorageService.deleteFile(blog.coverImage);

    res.json({ success: true, message: 'Blog deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
