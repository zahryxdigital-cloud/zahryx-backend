import { Request, Response } from 'express';
import { Inquiry } from '../models/Inquiry';
import { InquiryValidationSchema } from '../validators/schema';
import { MailService } from '../services/mailService';

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const validated = InquiryValidationSchema.parse(req.body);
    const inquiry = await Inquiry.create(validated);
    
    // Send background mail notification safely
    await MailService.sendInquiryNotification(inquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry successfully saved. Zahryx Digital has received your request!',
      data: inquiry
    });
  } catch (error: any) {
    res.status(400).json({ error: error.errors ? error.errors[0].message : error.message });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'contacted', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status type.' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    res.json({ success: true, message: 'Inquiry status updated successfully.', data: inquiry });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
