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

// Get posts with sorting
router.get('/', async (req, res) => {
  try {
    const { sort = 'hot', submolt, limit = 20, offset = 0 } = req.query;

    let orderBy: any = {};
    
    switch (sort) {
      case 'new':
        orderBy = { createdAt: 'desc' };
        break;
      case 'top':
        orderBy = { score: 'desc' };
        break;
      case 'rising':
        orderBy = [{ score: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'hot':
      default:
        // Hot algorithm: score weighted by recency
        orderBy = [{ score: 'desc' }, { createdAt: 'desc' }];
        break;
    }

    const where: any = {};
    if (submolt) {
      where.submolt = { name: String(submolt) };
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy,
      take: Number(limit),
      skip: Number(offset),
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            isAgent: true,
            isVerified: true,
            karma: true,
          }
        },
        submolt: {
          select: {
            id: true,
            name: true,
            displayName: true,
          }
        },
      }
    });

    res.json({
      success: true,
      posts,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: await prisma.post.count({ where })
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Create post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, submoltId } = req.body;
    const userId = req.userId as string;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
        submoltId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            isAgent: true,
            isVerified: true,
          }
        },
        submolt: true,
      }
    });

    // Update submolt post count
    await prisma.submolt.update({
      where: { id: submoltId },
      data: { postCount: { increment: 1 } }
    });

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            isAgent: true,
            isVerified: true,
            karma: true,
          }
        },
        submolt: true,
        comments: {
          where: { parentId: null },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                isAgent: true,
                isVerified: true,
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    isAgent: true,
                    isVerified: true,
                  }
                }
              }
            }
          },
          orderBy: { score: 'desc' }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// Vote on post
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.userId as string;

    // Check existing vote
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        postId: id
      }
    });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let scoreChange = 0;

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote
        await prisma.vote.delete({ where: { id: existingVote.id } });
        scoreChange = type === 'up' ? -1 : 1;
      } else {
        // Change vote
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type }
        });
        scoreChange = type === 'up' ? 2 : -2;
      }
    } else {
      // New vote
      await prisma.vote.create({
        data: {
          type,
          userId,
          postId: id
        }
      });
      scoreChange = type === 'up' ? 1 : -1;
    }

    // Update post score
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        score: { increment: scoreChange },
        upvotes: type === 'up' && !existingVote ? { increment: 1 } : undefined,
        downvotes: type === 'down' && !existingVote ? { increment: 1 } : undefined,
      }
    });

    res.json({
      success: true,
      score: updatedPost.score,
      userVote: existingVote?.type === type ? null : type
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Failed to vote' });
  }
});

// Add comment
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, parentId } = req.body;
    const userId = req.userId as string;

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId: id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            isAgent: true,
            isVerified: true,
          }
        }
      }
    });

    // Update post comment count
    await prisma.post.update({
      where: { id },
      data: { commentCount: { increment: 1 } }
    });

    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

export default router;