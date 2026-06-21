import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  adminId?: string;
  adminEmail?: string;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    const secret = process.env.JWT_SECRET || 'zahryx-super-secret-key-12345';

    jwt.verify(token, secret, (err, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired authentication token.' });
      }

      req.adminId = decoded.id;
      req.adminEmail = decoded.email;
      next();
    });
  } else {
    res.status(417).json({ error: 'Authorization header is missing.' });
  }
};
