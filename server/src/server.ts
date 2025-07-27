import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers/appRouter';

const app = express();
const PORT = 3001;

// Enable CORS for Angular frontend
app.use(cors({
  origin: 'http://localhost:4200', // Angular dev server
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Create tRPC middleware
const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}), // Empty context for this example
});

// Mount tRPC middleware at /trpc
app.use('/trpc', trpcMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint to verify server is working
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      '/trpc/users/getAll',
      '/trpc/posts/getAll',
      '/trpc/products/getAll',
      '/trpc/utils/health'
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 tRPC server running on http://localhost:${PORT}`);
  console.log(`📡 tRPC endpoint available at http://localhost:${PORT}/trpc`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint at http://localhost:${PORT}/test`);
}); 