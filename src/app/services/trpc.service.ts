import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { 
  User, 
  Post, 
  CreateUserInput, 
  UpdateUserInput, 
  GreetingResponse, 
  SlowQueryResponse, 
  Product, 
  CreateProductInput, 
  UpdateProductInput 
} from '../shared/types';

@Injectable({
  providedIn: 'root'
})
export class TrpcService {
  // Base URL for the tRPC server
  private readonly baseUrl = 'http://localhost:3001/trpc';

  // BehaviorSubject to track loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // BehaviorSubject to track error state
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  /**
   * Generic method to make HTTP requests to tRPC endpoints
   */
  private makeRequest<T>(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const url = `${this.baseUrl}/${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }

    return from(fetch(url, options)).pipe(
      map(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      }),
      switchMap(response => from(response.json())),
      map((data: any) => {
        this.loadingSubject.next(false);
        return data.result?.data || data;
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'An error occurred');
        throw error;
      })
    );
  }

  /**
   * Get a greeting message from the server
   */
  getGreeting(name?: string): Observable<GreetingResponse> {
    const params = name ? `?input=${encodeURIComponent(JSON.stringify({ name }))}` : '';
    return this.makeRequest<GreetingResponse>(`utils.greeting${params}`);
  }

  /**
   * Get all users from the server
   */
  getUsers(): Observable<User[]> {
    return this.makeRequest<User[]>('users.getAll');
  }

  /**
   * Get a specific user by ID
   */
  getUserById(id: number): Observable<User> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ id }))}`;
    return this.makeRequest<User>(`users.getById${params}`);
  }

  /**
   * Get all posts with user information
   */
  getPosts(): Observable<Post[]> {
    return this.makeRequest<Post[]>('posts.getAll');
  }

  /**
   * Create a new user
   */
  createUser(userData: CreateUserInput): Observable<User> {
    return this.makeRequest<User>('users.create', 'POST', userData);
  }

  /**
   * Update an existing user
   */
  updateUser(userData: UpdateUserInput): Observable<User> {
    return this.makeRequest<User>('users.update', 'POST', userData);
  }

  /**
   * Test error handling
   */
  testError(shouldError: boolean): Observable<{ message: string }> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ shouldError }))}`;
    return this.makeRequest<{ message: string }>(`utils.testError${params}`);
  }

  /**
   * Test slow query with custom delay
   */
  slowQuery(delay: number): Observable<SlowQueryResponse> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ delay }))}`;
    return this.makeRequest<SlowQueryResponse>(`utils.slowQuery${params}`);
  }

  /**
   * Get server health information
   */
  getHealth(): Observable<any> {
    return this.makeRequest<any>('utils.health');
  }

  /**
   * Get server information
   */
  getServerInfo(): Observable<any> {
    return this.makeRequest<any>('utils.serverInfo');
  }

  /**
   * Search users by name
   */
  searchUsers(query: string): Observable<User[]> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ query }))}`;
    return this.makeRequest<User[]>(`users.search${params}`);
  }

  /**
   * Get posts by user ID
   */
  getPostsByUserId(userId: number): Observable<Post[]> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ userId }))}`;
    return this.makeRequest<Post[]>(`posts.getByUserId${params}`);
  }

  /**
   * Get all products
   */
  getProducts(): Observable<Product[]> {
    return this.makeRequest<Product[]>('products.getAll');
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ category }))}`;
    return this.makeRequest<Product[]>(`products.getByCategory${params}`);
  }

  /**
   * Get products in stock
   */
  getProductsInStock(): Observable<Product[]> {
    return this.makeRequest<Product[]>('products.getInStock');
  }

  /**
   * Get product by ID
   */
  getProductById(id: number): Observable<Product> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ id }))}`;
    return this.makeRequest<Product>(`products.getById${params}`);
  }

  /**
   * Create a new product
   */
  createProduct(productData: CreateProductInput): Observable<Product> {
    return this.makeRequest<Product>('products.create', 'POST', productData);
  }

  /**
   * Update an existing product
   */
  updateProduct(productData: UpdateProductInput): Observable<Product> {
    return this.makeRequest<Product>('products.update', 'POST', productData);
  }

  /**
   * Search products by name
   */
  searchProducts(query: string): Observable<Product[]> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ query }))}`;
    return this.makeRequest<Product[]>(`products.search${params}`);
  }

  /**
   * Get products by price range
   */
  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ minPrice, maxPrice }))}`;
    return this.makeRequest<Product[]>(`products.getByPriceRange${params}`);
  }

  /**
   * Clear the current error
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Get the current loading state
   */
  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Get the current error message
   */
  get currentError(): string | null {
    return this.errorSubject.value;
  }
} 