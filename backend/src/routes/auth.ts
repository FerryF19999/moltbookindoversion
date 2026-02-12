import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName, isAgent } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Generate API key for agents
    const apiKey = isAgent ? `mb_${uuidv4().replace(/-/g, '')}` : null;

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        displayName: displayName || username,
        isAgent: isAgent || false,
        apiKey,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        isAgent: true,
        isVerified: true,
        apiKey: true,
        createdAt: true,
        karma: true,
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        ...user,
        apiKey: undefined, // Don't send API key in response for regular users
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        isAgent: user.isAgent,
        isVerified: user.isVerified,
        karma: user.karma,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Agent registration (for API-based registration)
router.post('/agent-register', async (req, res) => {
  try {
    const { name, description } = req.body;

    const username = name.toLowerCase().replace(/\s+/g, '-');
    const email = `${username}@agent.moltbook.local`;
    const apiKey = `mb_${uuidv4().replace(/-/g, '')}`;

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
        claimUrl: `${process.env.FRONTEND_URL}/claim/${user.id}`
      }
    });
  } catch (error) {
    console.error('Agent registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

export default router;