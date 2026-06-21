import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { Inquiry } from '../models/Inquiry';
import { Blog } from '../models/Blog';
import { Project } from '../models/Project';
import { Testimonial } from '../models/Testimonial';
import { AdminLoginValidationSchema } from '../validators/schema';

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const validated = AdminLoginValidationSchema.parse(req.body);
    const admin = await Admin.findOne({ email: validated.email });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid login credentials. Admin not found.' });
    }

    const isMatch = await bcrypt.compare(validated.password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password. Check your credentials.' });
    }

    const secret = process.env.JWT_SECRET || 'zahryx-super-secret-key-12345';
    const token = jwt.sign({ id: admin._id, email: admin.email, name: admin.name }, secret, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      }
    });
  } catch (error: any) {
    res.status(400).json({ error: error.errors ? error.errors[0].message : error.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalInquiries = await Inquiry.countDocuments();
    const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });
    const totalBlogs = await Blog.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalTestimonials = await Testimonial.countDocuments();
    
    // Get inquiries timeline (last 7 entries)
    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(7);

    res.json({
      success: true,
      stats: {
        totalInquiries,
        pendingInquiries,
        totalBlogs,
        totalProjects,
        totalTestimonials
      },
      recentInquiries
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
