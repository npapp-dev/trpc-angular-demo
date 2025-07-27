import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TrpcService } from '../../services/trpc.service';
import { GreetingResponse } from '../../shared/types';
import { Subscription } from 'rxjs';

interface TestResult {
  endpoint: string;
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  greetingName = '';
  greetingResult: GreetingResponse | null = null;
  testResults: TestResult[] | null = null;
  error: string | null = null;
  isLoading = false;
  
  private subscriptions: Subscription[] = [];
  private trpcService = inject(TrpcService);

  ngOnInit(): void {
    // Subscribe to loading and error states
    this.subscriptions.push(
      this.trpcService.loading$.subscribe(loading => {
        this.isLoading = loading;
      })
    );

    this.subscriptions.push(
      this.trpcService.error$.subscribe(error => {
        this.error = error;
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Get a greeting from the tRPC server
   * Demonstrates basic tRPC query with RxJS observable
   */
  getGreeting(): void {
    this.greetingResult = null;
    this.error = null;

    this.subscriptions.push(
      this.trpcService.getGreeting(this.greetingName || undefined).subscribe({
        next: (result) => {
          this.greetingResult = result;
        },
        error: (error) => {
          this.error = error.message || 'Failed to get greeting';
        }
      })
    );
  }

  /**
   * Test new namespaced endpoints
   */
  testNewEndpoints(): void {
    this.testResults = [];
    this.error = null;

    const tests = [
      {
        name: 'Users - GetAll',
        test: () => this.trpcService.getUsers()
      },
      {
        name: 'Posts - GetAll',
        test: () => this.trpcService.getPosts()
      },
      {
        name: 'Products - GetAll',
        test: () => this.trpcService.getProducts()
      },
      {
        name: 'Utils - Health',
        test: () => this.trpcService.getHealth()
      },
      {
        name: 'Utils - ServerInfo',
        test: () => this.trpcService.getServerInfo()
      },
      {
        name: 'Products - InStock',
        test: () => this.trpcService.getProductsInStock()
      }
    ];

    let completedTests = 0;
    const totalTests = tests.length;

    tests.forEach(({ name, test }) => {
      this.subscriptions.push(
        test().subscribe({
          next: (result) => {
            this.testResults.push({
              endpoint: name,
              success: true,
              message: `Received ${Array.isArray(result) ? result.length : 1} item(s)`
            });
            completedTests++;
            if (completedTests === totalTests) {
              this.isLoading = false;
            }
          },
          error: (error) => {
            this.testResults.push({
              endpoint: name,
              success: false,
              message: error.message || 'Request failed'
            });
            completedTests++;
            if (completedTests === totalTests) {
              this.isLoading = false;
            }
          }
        })
      );
    });
  }

  /**
   * Clear the current error
   */
  clearError(): void {
    this.error = null;
    this.trpcService.clearError();
  }
} 