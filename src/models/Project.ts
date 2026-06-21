import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  client: { type: String, required: true },
  category: { type: String, required: true }, // e.g. 'Gym', 'Ecommerce', 'Salon', 'Restaurant'
  tags: [{ type: String }],
  coverImage: { type: String }, // optional, can be set later via upload
  beforeImage: { type: String }, // optional, for before/after view
  afterImage: { type: String }, // optional, for before/after view
  projectUrl: { type: String },
  growth: { type: String, default: '+0% Growth' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export const Project = model('Project', ProjectSchema);
