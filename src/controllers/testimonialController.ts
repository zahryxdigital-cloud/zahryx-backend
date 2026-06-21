import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial';

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }
    res.json({ success: true, data: testimonial });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }
    res.json({ success: true, message: 'Testimonial deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
