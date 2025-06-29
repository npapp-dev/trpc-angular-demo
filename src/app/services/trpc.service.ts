import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User, Post, CreateUserInput, UpdateUserInput, GreetingResponse, SlowQueryResponse } from '../shared/types';

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
   * This provides a consistent way to handle loading states and errors
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
    return this.makeRequest<GreetingResponse>(`greeting${params}`);
  }

  /**
   * Get all users from the server
   */
  getUsers(): Observable<User[]> {
    return this.makeRequest<User[]>('getUsers');
  }

  /**
   * Get a specific user by ID
   */
  getUserById(id: number): Observable<User> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ id }))}`;
    return this.makeRequest<User>(`getUserById${params}`);
  }

  /**
   * Get all posts with user information
   */
  getPosts(): Observable<Post[]> {
    return this.makeRequest<Post[]>('getPosts');
  }

  /**
   * Create a new user
   */
  createUser(userData: CreateUserInput): Observable<User> {
    return this.makeRequest<User>('createUser', 'POST', userData);
  }

  /**
   * Update an existing user
   */
  updateUser(userData: UpdateUserInput): Observable<User> {
    return this.makeRequest<User>('updateUser', 'POST', userData);
  }

  /**
   * Test error handling
   */
  testError(shouldError: boolean): Observable<{ message: string }> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ shouldError }))}`;
    return this.makeRequest<{ message: string }>(`getUserWithError${params}`);
  }

  /**
   * Test slow query with custom delay
   */
  slowQuery(delay: number): Observable<SlowQueryResponse> {
    const params = `?input=${encodeURIComponent(JSON.stringify({ delay }))}`;
    return this.makeRequest<SlowQueryResponse>(`slowQuery${params}`);
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