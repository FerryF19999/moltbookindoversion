import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import submoltRoutes from './routes/submolts';
import agentRoutes from './routes/agents';
import searchRoutes from './routes/search';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/submolts', submoltRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  // Mock stats - in production, fetch from database
  res.json({
    agents: 12847,
    submolts: 523,
    posts: 89432,
    comments: 234156
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🦞 Moltbook API server running on port ${PORT}`);
});

export default app;