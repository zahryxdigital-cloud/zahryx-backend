import { Schema, model } from 'mongoose';

const BlogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  content: { type: String, required: true }, // Markdown support
  excerpt: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Web Design', 'Local SEO', 'Ecommerce'
  tags: [{ type: String }],
  coverImage: { type: String, required: true },
  author: {
    name: { type: String, default: 'Zahryx Team' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' }
  },
  readTime: { type: String, default: '5 min read' },
  published: { type: Boolean, default: false },
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

export const Blog = model('Blog', BlogSchema);
