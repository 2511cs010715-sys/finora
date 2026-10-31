const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// JSON & URL-encoded Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root / Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Modern AI Chat Assistant API',
    version: '1.0.0',
    database: getDBStatus() ? 'MongoDB Connected' : 'In-Memory Persistence Fallback Active',
    ai_provider: process.env.AI_PROVIDER || 'auto',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/messages', require('./routes/chatRoutes'));

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🤖 AI Chat Assistant Backend Server`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});

module.exports = { app, server };
