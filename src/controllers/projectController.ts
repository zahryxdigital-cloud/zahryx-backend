import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { ProjectValidationSchema } from '../validators/schema';
import { StorageService } from '../services/storageService';

export const createProject = async (req: Request, res: Response) => {
  try {
    console.log('CreateProject payload:', req.body);
    const validated = ProjectValidationSchema.parse(req.body);
    const project = await Project.create(validated);
    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    res.status(400).json({ error: error.errors ? error.errors[0].message : error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = ProjectValidationSchema.parse(req.body);
    const project = await Project.findByIdAndUpdate(id, validated, { new: true });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(400).json({ error: error.errors ? error.errors[0].message : error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    
    // Clean up images
    if (project.coverImage) await StorageService.deleteFile(project.coverImage);
    if (project.beforeImage) await StorageService.deleteFile(project.beforeImage);
    if (project.afterImage) await StorageService.deleteFile(project.afterImage);

    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
