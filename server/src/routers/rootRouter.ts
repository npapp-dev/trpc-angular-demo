import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { User } from '../models/user';

// Initialize tRPC
const t = initTRPC.create();

// Sample data - in a real app, this would come from a database
const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
];

const posts = [
  { id: 1, title: 'First Post', content: 'This is the first post', userId: 1 },
  { id: 2, title: 'Second Post', content: 'This is the second post', userId: 2 },
  { id: 3, title: 'Third Post', content: 'This is the third post', userId: 1 },
];

const products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
  { id: 3, name: 'Product 3', price: 300 },
];

// Create the router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Define the main app router with various procedures
export const appRouter = router({
  // Simple query that returns a greeting
  greeting: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        message: `Hello ${input.name ?? 'World'}!`,
        timestamp: new Date().toISOString(),
      };
    }),

  // Query that returns all users
  getUsers: publicProcedure.output(z.array(z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    age: z.number(),
  }))).query(() => {
    return users;
  }),

  // Query that returns a specific user by ID
  getUserById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const user = users.find(u => u.id === input.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }),

  // Query that returns posts with user information
  getPosts: publicProcedure.query(() => {
    return posts.map(post => ({
      ...post,
      user: users.find(u => u.id === post.userId),
    }));
  }),

  // Mutation to create a new user
  createUser: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      age: z.number().min(0),
    }))
    .mutation(({ input }) => {
      const newUser = {
        id: users.length + 1,
        ...input,
      };
      users.push(newUser);
      return newUser;
    }),

  // Mutation to update a user
  updateUser: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      age: z.number().min(0).optional(),
    }))
    .mutation(({ input }) => {
      const userIndex = users.findIndex(u => u.id === input.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      users[userIndex] = { ...users[userIndex], ...input };
      return users[userIndex];
    }),

  // Query that demonstrates error handling
  getUserWithError: publicProcedure
    .input(z.object({ shouldError: z.boolean() }))
    .query(({ input }) => {
      if (input.shouldError) {
        throw new Error('This is a test error from the server');
      }
      return { message: 'No error occurred' };
    }),

  // Query that simulates a slow response
  slowQuery: publicProcedure
    .input(z.object({ delay: z.number().min(0).max(5000) }))
    .query(async ({ input }) => {
      await new Promise(resolve => setTimeout(resolve, input.delay));
      return {
        message: `This response was delayed by ${input.delay}ms`,
        timestamp: new Date().toISOString(),
      };
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter; 