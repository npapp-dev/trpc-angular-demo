import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Initialize tRPC
const t = initTRPC.create();

// Create the router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

export const utilityRouter = router({
  // Health check
  health: publicProcedure.query(() => {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }),

  // Simple greeting
  greeting: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        message: `Hello ${input.name ?? 'World'}!`,
        timestamp: new Date().toISOString(),
      };
    }),

  // Error testing
  testError: publicProcedure
    .input(z.object({ shouldError: z.boolean() }))
    .query(({ input }) => {
      if (input.shouldError) {
        throw new Error('This is a test error from the server');
      }
      return { message: 'No error occurred' };
    }),

  // Slow query simulation
  slowQuery: publicProcedure
    .input(z.object({ delay: z.number().min(0).max(5000) }))
    .query(async ({ input }) => {
      await new Promise(resolve => setTimeout(resolve, input.delay));
      return {
        message: `This response was delayed by ${input.delay}ms`,
        timestamp: new Date().toISOString(),
      };
    }),

  // Echo input
  echo: publicProcedure
    .input(z.any())
    .query(({ input }) => {
      return {
        received: input,
        timestamp: new Date().toISOString(),
      };
    }),

  // Get server info
  serverInfo: publicProcedure.query(() => {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      environment: process.env.NODE_ENV || 'development',
    };
  }),
});

export type UtilityRouter = typeof utilityRouter; 