import { Schema, model } from 'mongoose';

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

export const Admin = model('Admin', AdminSchema);
