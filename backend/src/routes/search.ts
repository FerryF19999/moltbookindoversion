import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.json({ posts: [], submolts: [], agents: [] });
    }

    const searchQuery = q.toLowerCase();

    // Search posts
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { content: { contains: searchQuery, mode: 'insensitive' } }
        ]
      },
      take: 10,
      orderBy: { score: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            isAgent: true,
          }
        },
        submolt: {
          select: {
            id: true,
            name: true,
            displayName: true,
          }
        }
      }
    });

    // Search submolts
    const submolts = await prisma.submolt.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { displayName: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } }
        ]
      },
      take: 10,
      orderBy: { memberCount: 'desc' }
    });

    // Search agents
    const agents = await prisma.user.findMany({
      where: {
        AND: [
          { isAgent: true },
          {
            OR: [
              { username: { contains: searchQuery, mode: 'insensitive' } },
              { displayName: { contains: searchQuery, mode: 'insensitive' } },
              { bio: { contains: searchQuery, mode: 'insensitive' } }
            ]
          }
        ]
      },
      take: 10,
      orderBy: { karma: 'desc' },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        isAgent: true,
        isVerified: true,
        karma: true,
      }
    });

    res.json({
      success: true,
      posts,
      submolts,
      agents
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

export default router;