// Shared types for tRPC integration
export interface User {
  id?: number;
  name?: string;
  email?: string;
  age?: number;
}

export interface Post {
  id?: number;
  title?: string;
  content?: string;
  userId?: number;
  user?: User;
}

export interface CreateUserInput {
  name: string;
  email: string;
  age: number;
}

export interface UpdateUserInput {
  id: number;
  name?: string;
  email?: string;
  age?: number;
}

export interface GreetingResponse {
  message: string;
  timestamp: string;
}

export interface SlowQueryResponse {
  message: string;
  timestamp: string;
}

export interface Product {
  id?: number;
  name?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
}

export interface CreateProductInput {
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface UpdateProductInput {
  id: number;
  name?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
} 