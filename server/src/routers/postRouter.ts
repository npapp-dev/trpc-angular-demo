import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Initialize tRPC
const t = initTRPC.create();

// Sample data - in a real app, this would come from a database
const posts = [
  { id: 1, title: 'First Post', content: 'This is the first post', userId: 1, createdAt: new Date('2024-01-01') },
  { id: 2, title: 'Second Post', content: 'This is the second post', userId: 2, createdAt: new Date('2024-01-02') },
  { id: 3, title: 'Third Post', content: 'This is the third post', userId: 1, createdAt: new Date('2024-01-03') },
];

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
];

// Create the router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

export const postRouter = router({
  // Get all posts with user information
  getAll: publicProcedure.query(() => {
    return posts.map(post => ({
      ...post,
      user: users.find(u => u.id === post.userId),
    }));
  }),

  // Get post by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const post = posts.find(p => p.id === input.id);
      if (!post) {
        throw new Error('Post not found');
      }
      return {
        ...post,
        user: users.find(u => u.id === post.userId),
      };
    }),

  // Get posts by user ID
  getByUserId: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => {
      return posts
        .filter(post => post.userId === input.userId)
        .map(post => ({
          ...post,
          user: users.find(u => u.id === post.userId),
        }));
    }),

  // Create new post
  create: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      userId: z.number(),
    }))
    .mutation(({ input }) => {
      const newPost = {
        id: posts.length + 1,
        ...input,
        createdAt: new Date(),
      };
      posts.push(newPost);
      return {
        ...newPost,
        user: users.find(u => u.id === newPost.userId),
      };
    }),

  // Update post
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
    }))
    .mutation(({ input }) => {
      const postIndex = posts.findIndex(p => p.id === input.id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      posts[postIndex] = { ...posts[postIndex], ...input };
      return {
        ...posts[postIndex],
        user: users.find(u => u.id === posts[postIndex].userId),
      };
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const postIndex = posts.findIndex(p => p.id === input.id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      const deletedPost = posts.splice(postIndex, 1)[0];
      return {
        ...deletedPost,
        user: users.find(u => u.id === deletedPost.userId),
      };
    }),

  // Search posts by title or content
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      return posts
        .filter(post => 
          post.title.toLowerCase().includes(input.query.toLowerCase()) ||
          post.content.toLowerCase().includes(input.query.toLowerCase())
        )
        .map(post => ({
          ...post,
          user: users.find(u => u.id === post.userId),
        }));
    }),
});

export type PostRouter = typeof postRouter; 