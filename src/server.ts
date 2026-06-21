import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/api';
import { errorHandler } from './middleware/errorHandler';

// Load variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mdfaisalansari:grantmeaccess@cluster0.vypmgdq.mongodb.net/zahryx';

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins for dynamic demo integrations
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());

// Serve Static Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api', apiRouter);

// Base Status Route
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Zahryx Digital Agency Backend API is fully operational.',
    dbConnected: mongoose.connection.readyState === 1
  });
});

// Error handling
app.use(errorHandler);

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('⚡ Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Zahryx server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    // Proceeding to run server to allow frontend testing even without local DB running
    app.listen(PORT, () => {
      console.log(`🚀 Zahryx server running on port ${PORT} (Warning: MongoDB disconnected)`);
    });
  });
