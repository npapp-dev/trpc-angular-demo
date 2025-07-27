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

// Create the router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

export const userRouter = router({
  // Get all users
  getAll: publicProcedure
    .output(z.array(z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      age: z.number(),
    })))
    .query(() => {
      return users;
    }),

  // Get user by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const user = users.find(u => u.id === input.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }),

  // Create new user
  create: publicProcedure
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

  // Update user
  update: publicProcedure
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

  // Delete user
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const userIndex = users.findIndex(u => u.id === input.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const deletedUser = users.splice(userIndex, 1)[0];
      return deletedUser;
    }),

  // Search users by name
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      return users.filter(user => 
        user.name?.toLowerCase().includes(input.query.toLowerCase())
      );
    }),
});

export type UserRouter = typeof userRouter; 