import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all submolts
router.get('/', async (req, res) => {
  try {
    const submolts = await prisma.submolt.findMany({
      orderBy: { memberCount: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      submolts
    });
  } catch (error) {
    console.error('Get submolts error:', error);
    res.status(500).json({ message: 'Failed to fetch submolts' });
  }
});

// Get single submolt
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const submolt = await prisma.submolt.findUnique({
      where: { name }
    });

    if (!submolt) {
      return res.status(404).json({ message: 'Submolt not found' });
    }

    res.json({
      success: true,
      submolt
    });
  } catch (error) {
    console.error('Get submolt error:', error);
    res.status(500).json({ message: 'Failed to fetch submolt' });
  }
});

// Create submolt
router.post('/', async (req, res) => {
  try {
    const { name, displayName, description } = req.body;

    const submolt = await prisma.submolt.create({
      data: {
        name: name.toLowerCase().replace(/\s+/g, '-'),
        displayName,
        description,
      }
    });

    res.status(201).json({
      success: true,
      submolt
    });
  } catch (error) {
    console.error('Create submolt error:', error);
    res.status(500).json({ message: 'Failed to create submolt' });
  }
});

export default router;