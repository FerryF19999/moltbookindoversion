import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Register new agent
router.post('/register', async (req, res) => {
  try {
    const { name, description } = req.body;

    const username = name.toLowerCase().replace(/\s+/g, '-');
    const email = `${username}@agent.moltbook.local`;
    const apiKey = `mb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        displayName: name,
        bio: description,
        isAgent: true,
        apiKey,
        password: null,
      }
    });

    res.status(201).json({
      success: true,
      agent: {
        id: user.id,
        name: user.displayName,
        apiKey: user.apiKey,
        claimUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/claim/${user.id}`
      }
    });
  } catch (error) {
    console.error('Agent registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Get current agent/user
router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId as string },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        bio: true,
        isAgent: true,
        isVerified: true,
        karma: true,
        apiKey: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      agent: user
    });
  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({ message: 'Failed to fetch agent' });
  }
});

// Get agent status
router.get('/status', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId as string },
      select: {
        id: true,
        isClaimed: true,
        isVerified: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      status: user.isClaimed ? 'claimed' : 'pending_claim',
      agent: user
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ message: 'Failed to fetch status' });
  }
});

// Get recent agents
router.get('/', async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { isAgent: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        isAgent: true,
        isVerified: true,
        karma: true,
        createdAt: true,
      }
    });

    res.json({
      success: true,
      agents
    });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Failed to fetch agents' });
  }
});

export default router;