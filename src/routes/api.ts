import { Router, Request, Response } from 'express';
import multer from 'multer';
import { loginAdmin, getDashboardStats } from '../controllers/authController';
import { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController';
import { createBlog, getBlogs, getBlogBySlug, updateBlog, deleteBlog } from '../controllers/blogController';
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from '../controllers/projectController';
import { createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { authenticateJWT } from '../middleware/auth';
import { StorageService } from '../services/storageService';

const router = Router();

// Multer memory storage config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Auth Routes
router.post('/auth/login', loginAdmin);
router.get('/auth/stats', authenticateJWT, getDashboardStats);

// Inquiry (Leads) Routes
router.post('/inquiries', createInquiry);
router.get('/inquiries', authenticateJWT, getInquiries);
router.patch('/inquiries/:id/status', authenticateJWT, updateInquiryStatus);
router.delete('/inquiries/:id', authenticateJWT, deleteInquiry);

// Blog Routes
router.post('/blogs', authenticateJWT, createBlog);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.put('/blogs/:id', authenticateJWT, updateBlog);
router.delete('/blogs/:id', authenticateJWT, deleteBlog);

// Project/Portfolio Routes
router.post('/projects', authenticateJWT, createProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.put('/projects/:id', authenticateJWT, updateProject);
router.delete('/projects/:id', authenticateJWT, deleteProject);

// Testimonial Routes
router.post('/testimonials', authenticateJWT, createTestimonial);
router.get('/testimonials', getTestimonials);
router.put('/testimonials/:id', authenticateJWT, updateTestimonial);
router.delete('/testimonials/:id', authenticateJWT, deleteTestimonial);

// File Upload endpoint (Used by Admin Panel for Rich Editor / Mockups / Avatars)
router.post('/upload', authenticateJWT, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided for upload.' });
    }
    const fileUrl = await StorageService.uploadFile(req.file);
    res.json({ success: true, url: fileUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
