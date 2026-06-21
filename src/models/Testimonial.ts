import { Schema, model } from 'mongoose';

const TestimonialSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g. 'Owner of Elite Fitness'
  company: { type: String, required: true }, // e.g. 'Elite Gym'
  review: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  businessType: { type: String } // e.g. 'Gym', 'Restaurant' to filter/segment reviews
}, { timestamps: true });

export const Testimonial = model('Testimonial', TestimonialSchema);
