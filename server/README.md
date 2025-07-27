# tRPC Server with Multiple Routers

This server demonstrates how to organize and merge multiple tRPC routers for better code organization and maintainability.

## Router Structure

The server is organized into multiple specialized routers:

### 1. User Router (`userRouter.ts`)
- **Path**: `/trpc/users/*`
- **Operations**:
  - `getAll` - Get all users
  - `getById` - Get user by ID
  - `create` - Create new user
  - `update` - Update user
  - `delete` - Delete user
  - `search` - Search users by name

### 2. Post Router (`postRouter.ts`)
- **Path**: `/trpc/posts/*`
- **Operations**:
  - `getAll` - Get all posts with user info
  - `getById` - Get post by ID
  - `getByUserId` - Get posts by user ID
  - `create` - Create new post
  - `update` - Update post
  - `delete` - Delete post
  - `search` - Search posts by title/content

### 3. Product Router (`productRouter.ts`)
- **Path**: `/trpc/products/*`
- **Operations**:
  - `getAll` - Get all products
  - `getById` - Get product by ID
  - `create` - Create new product
  - `update` - Update product
  - `delete` - Delete product
  - `getByCategory` - Get products by category
  - `getInStock` - Get products in stock
  - `search` - Search products by name
  - `getByPriceRange` - Get products by price range

### 4. Utility Router (`utilityRouter.ts`)
- **Path**: `/trpc/utils/*`
- **Operations**:
  - `health` - Health check
  - `greeting` - Simple greeting
  - `testError` - Test error handling
  - `slowQuery` - Simulate slow queries
  - `echo` - Echo input
  - `serverInfo` - Get server information

## How to Use

### Starting the Server
```bash
# Development with nodemon (watches for file changes)
npm run dev:watch

# Development with tsx
npm run dev

# Production
npm run build
npm start
```

### API Endpoints

All endpoints are available under `/trpc` with the following structure:

```
/trpc/users/getAll
/trpc/users/getById
/trpc/users/create
/trpc/users/update
/trpc/users/delete
/trpc/users/search

/trpc/posts/getAll
/trpc/posts/getById
/trpc/posts/getByUserId
/trpc/posts/create
/trpc/posts/update
/trpc/posts/delete
/trpc/posts/search

/trpc/products/getAll
/trpc/products/getById
/trpc/products/create
/trpc/products/update
/trpc/products/delete
/trpc/products/getByCategory
/trpc/products/getInStock
/trpc/products/search
/trpc/products/getByPriceRange

/trpc/utils/health
/trpc/utils/greeting
/trpc/utils/testError
/trpc/utils/slowQuery
/trpc/utils/echo
/trpc/utils/serverInfo
```

### Example Usage

#### Get all users
```typescript
const users = await trpc.users.getAll.query();
```

#### Create a new user
```typescript
const newUser = await trpc.users.create.mutate({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});
```

#### Get posts by user ID
```typescript
const userPosts = await trpc.posts.getByUserId.query({ userId: 1 });
```

#### Search products
```typescript
const products = await trpc.products.search.query({ query: 'electronics' });
```

## Adding New Routers

To add a new router:

1. Create a new router file (e.g., `orderRouter.ts`)
2. Define your procedures using `publicProcedure`
3. Export the router and its type
4. Import and add it to `appRouter.ts`
5. Export it from `index.ts`

Example:
```typescript
// orderRouter.ts
export const orderRouter = router({
  getAll: publicProcedure.query(() => {
    // Implementation
  }),
});

// appRouter.ts
export const appRouter = router({
  users: userRouter,
  posts: postRouter,
  products: productRouter,
  utils: utilityRouter,
  orders: orderRouter, // Add your new router here
});
```

## Benefits of This Structure

1. **Modularity**: Each router handles a specific domain
2. **Maintainability**: Easy to find and modify specific functionality
3. **Scalability**: Easy to add new routers without affecting existing ones
4. **Type Safety**: Full TypeScript support with proper type inference
5. **Organization**: Clear separation of concerns
6. **Testing**: Each router can be tested independently 