import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', err.message || err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal server error occurred on Zahryx backend.';
  
  res.status(status).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
