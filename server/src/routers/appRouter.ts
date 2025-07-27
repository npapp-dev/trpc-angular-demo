import { initTRPC } from '@trpc/server';
import { userRouter } from './userRouter';
import { postRouter } from './postRouter';
import { productRouter } from './productRouter';
import { utilityRouter } from './utilityRouter';

// Initialize tRPC
const t = initTRPC.create();

// Create the router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Debug: Log router imports
console.log('🔧 Loading routers...');
console.log('  - userRouter:', !!userRouter);
console.log('  - postRouter:', !!postRouter);
console.log('  - productRouter:', !!productRouter);
console.log('  - utilityRouter:', !!utilityRouter);

// Merge all routers into the main app router
export const appRouter = router({
  // Namespace each router for better organization
  users: userRouter,
  posts: postRouter,
  products: productRouter,
  utils: utilityRouter,
});

// Debug: Log the final router
console.log('✅ App router created successfully');

// Export type definition of API
export type AppRouter = typeof appRouter; 