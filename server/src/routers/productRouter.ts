import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Initialize tRPC
const t = initTRPC.create();

const products = [
  { id: 1, name: 'Product 1', price: 100, category: 'Electronics', inStock: true },
  { id: 2, name: 'Product 2', price: 200, category: 'Clothing', inStock: true },
  { id: 3, name: 'Product 3', price: 300, category: 'Electronics', inStock: false },
  { id: 4, name: 'Product 4', price: 150, category: 'Books', inStock: true },
  { id: 5, name: 'Product 5', price: 250, category: 'Clothing', inStock: true },
];

// Create the router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

export const productRouter = router({
  // Get all products
  getAll: publicProcedure
    .output(z.array(z.object({
      id: z.number().optional(),
      name: z.string().optional(),
      price: z.number().optional(),
      category: z.string().optional(),
      inStock: z.boolean().optional(),
    })))
    .query(() => {
      return products;
    }),

  // Get product by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const product = products.find(p => p.id === input.id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    }),

  // Create new product
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      price: z.number().positive(),
      category: z.string().min(1),
      inStock: z.boolean(),
    }))
    .mutation(({ input }) => {
      const newProduct = {
        id: products.length + 1,
        ...input,
      };
      products.push(newProduct);
      return newProduct;
    }),

  // Update product
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      category: z.string().min(1).optional(),
      inStock: z.boolean().optional(),
    }))
    .mutation(({ input }) => {
      const productIndex = products.findIndex(p => p.id === input.id);
      if (productIndex === -1) {
        throw new Error('Product not found');
      }
      
      products[productIndex] = { ...products[productIndex], ...input };
      return products[productIndex];
    }),

  // Delete product
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const productIndex = products.findIndex(p => p.id === input.id);
      if (productIndex === -1) {
        throw new Error('Product not found');
      }
      
      const deletedProduct = products.splice(productIndex, 1)[0];
      return deletedProduct;
    }),

  // Get products by category
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ input }) => {
      return products.filter(product => product.category === input.category);
    }),

  // Get products in stock
  getInStock: publicProcedure.query(() => {
    return products.filter(product => product.inStock);
  }),

  // Search products by name
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      return products.filter(product => 
        product.name.toLowerCase().includes(input.query.toLowerCase())
      );
    }),

  // Get products by price range
  getByPriceRange: publicProcedure
    .input(z.object({ 
      minPrice: z.number().min(0), 
      maxPrice: z.number().min(0) 
    }))
    .query(({ input }) => {
      return products.filter(product => 
        product.price >= input.minPrice && product.price <= input.maxPrice
      );
    }),
});

export type ProductRouter = typeof productRouter;