import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from environment variables
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Local storage directory setup (fallback)
const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

// Ensure local upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class StorageService {
  /**
   * Uploads file either to Cloudinary (if configured) or locally.
   */
  static async uploadFile(file: Express.Multer.File): Promise<string> {
    // If Cloudinary keys are set in environmental variables, upload to Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'zahryx_digital' },
          (error, result) => {
            if (error) return reject(error);
            if (result) resolve(result.secure_url);
            else reject(new Error('Cloudinary upload returned undefined result.'));
          }
        );
        uploadStream.end(file.buffer);
      });
    }

    // Fallback local storage
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);
    
    await fs.promises.writeFile(filePath, file.buffer);
    
    const serverUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return `${serverUrl}/uploads/${uniqueName}`;
  }

  /**
   * Deletes file from Cloudinary (if configured) or locally.
   */
  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Check if it's a Cloudinary URL
      if (fileUrl.includes('cloudinary.com')) {
        const parts = fileUrl.split('/image/upload/');
        if (parts.length > 1) {
          const pathParts = parts[1].split('/');
          // Remove version component (e.g. v1712345678) if present
          if (pathParts[0].startsWith('v') && !isNaN(Number(pathParts[0].slice(1)))) {
            pathParts.shift();
          }
          const publicIdWithExt = pathParts.join('/');
          const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
          
          await cloudinary.uploader.destroy(publicId);
        }
        return;
      }

      // Local storage fallback deletion
      const parts = fileUrl.split('/uploads/');
      if (parts.length > 1) {
        const filename = parts[1];
        const filePath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }
}
