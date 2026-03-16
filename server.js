import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import customersRouter from './src/routes/customers.js';
import conversationsRouter from './src/routes/conversations.js';
import webhooksRouter from './src/routes/webhooks.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static frontend files
app.use(express.static('client/dist'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', instance: process.env.INSTANCE_NAME });
});

// API Routes
app.use('/api/customers', customersRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/webhooks', webhooksRouter);

// Live Chat Socket.IO
io.on('connection', (socket) => {
  console.log('Live chat client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Live chat client disconnected:', socket.id);
  });
});

// Serve index.html for all non-API routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile('client/dist/index.html', { root: __dirname });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Message Broker running on port ${PORT}`);
  console.log(`Instance: ${process.env.INSTANCE_NAME}`);
});

