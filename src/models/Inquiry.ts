import { Schema, model } from 'mongoose';

const InquirySchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String },
  businessName: { type: String },
  businessType: { type: String }, // e.g. 'Gym', 'Restaurant', etc.
  serviceNeeded: { type: String, required: true }, // e.g. 'Website Dev', 'SEO'
  budget: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'contacted', 'completed'], default: 'pending' },
}, { timestamps: true });

export const Inquiry = model('Inquiry', InquirySchema);
