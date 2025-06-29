import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrpcService } from '../../services/trpc.service';
import { SlowQueryResponse } from '../../shared/types';
import { Subscription, interval, forkJoin, of, timer } from 'rxjs';
import { switchMap, takeUntil, catchError, finalize } from 'rxjs/operators';

interface ReactiveResult {
  timestamp: Date;
  message: string;
}

interface BatchResult {
  type: string;
  message: string;
  duration: number;
}

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit, OnDestroy {
  // Error handling demo
  errorTestResult: { message: string } | null = null;
  
  // Slow query demo
  queryDelay = 2000;
  slowQueryResult: SlowQueryResponse | null = null;
  
  // Reactive patterns demo
  isReactiveDemoRunning = false;
  reactiveResults: ReactiveResult[] = [];
  private reactiveDemoSubscription: Subscription | null = null;
  
  // Batch operations demo
  batchResults: BatchResult[] = [];
  
  // General state
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
    this.stopReactiveDemo();
  }

  /**
   * Test error handling with tRPC
   */
  testError(shouldError: boolean): void {
    this.errorTestResult = null;
    this.error = null;

    this.subscriptions.push(
      this.trpcService.testError(shouldError).subscribe({
        next: (result) => {
          this.errorTestResult = result;
        },
        error: (error) => {
          this.error = error.message || 'Failed to test error handling';
        }
      })
    );
  }

  /**
   * Test slow query with custom delay
   */
  testSlowQuery(): void {
    this.slowQueryResult = null;
    this.error = null;

    this.subscriptions.push(
      this.trpcService.slowQuery(this.queryDelay).subscribe({
        next: (result) => {
          this.slowQueryResult = result;
        },
        error: (error) => {
          this.error = error.message || 'Failed to test slow query';
        }
      })
    );
  }

  /**
   * Start reactive demo with periodic tRPC calls
   */
  startReactiveDemo(): void {
    if (this.isReactiveDemoRunning) return;

    this.isReactiveDemoRunning = true;
    this.reactiveResults = [];
    this.error = null;

    // Create a periodic observable that makes tRPC calls every 2 seconds
    this.reactiveDemoSubscription = interval(2000).pipe(
      switchMap(() => {
        const timestamp = new Date();
        return this.trpcService.getGreeting(`Reactive Demo ${timestamp.getSeconds()}`).pipe(
          catchError(error => {
            return of({ message: `Error: ${error.message}`, timestamp: timestamp.toISOString() });
          })
        );
      }),
      takeUntil(timer(30000)) // Stop after 30 seconds
    ).subscribe({
      next: (result) => {
        this.reactiveResults.push({
          timestamp: new Date(),
          message: result.message
        });
      },
      error: (error) => {
        this.error = error.message || 'Reactive demo failed';
        this.isReactiveDemoRunning = false;
      },
      complete: () => {
        this.isReactiveDemoRunning = false;
        this.reactiveResults.push({
          timestamp: new Date(),
          message: 'Reactive demo completed after 30 seconds'
        });
      }
    });
  }

  /**
   * Stop reactive demo
   */
  stopReactiveDemo(): void {
    if (this.reactiveDemoSubscription) {
      this.reactiveDemoSubscription.unsubscribe();
      this.reactiveDemoSubscription = null;
    }
    this.isReactiveDemoRunning = false;
  }

  /**
   * Test sequential tRPC calls
   */
  testSequentialCalls(): void {
    this.batchResults = [];
    this.error = null;

    const startTime = Date.now();

    const sequentialCalls = [
      () => this.trpcService.getGreeting('Sequential 1'),
      () => this.trpcService.getGreeting('Sequential 2'),
      () => this.trpcService.getGreeting('Sequential 3'),
      () => this.trpcService.slowQuery(500),
      () => this.trpcService.getGreeting('Sequential 4')
    ];

    const executeSequential = (index: number) => {
      if (index >= sequentialCalls.length) {
        const totalDuration = Date.now() - startTime;
        this.batchResults.push({
          type: 'Sequential',
          message: `All sequential calls completed`,
          duration: totalDuration
        });
        return;
      }

      const callStartTime = Date.now();
      this.subscriptions.push(
        sequentialCalls[index]().subscribe({
          next: (result) => {
            const callDuration = Date.now() - callStartTime;
            this.batchResults.push({
              type: `Step ${index + 1}`,
              message: result.message || 'Call completed',
              duration: callDuration
            });
            executeSequential(index + 1);
          },
          error: (error) => {
            const callDuration = Date.now() - callStartTime;
            this.batchResults.push({
              type: `Step ${index + 1}`,
              message: `Error: ${error.message}`,
              duration: callDuration
            });
            executeSequential(index + 1);
          }
        })
      );
    };

    executeSequential(0);
  }

  /**
   * Test parallel tRPC calls
   */
  testParallelCalls(): void {
    this.batchResults = [];
    this.error = null;

    const startTime = Date.now();

    // Create multiple tRPC calls to run in parallel
    const parallelCalls = [
      this.trpcService.getGreeting('Parallel 1'),
      this.trpcService.getGreeting('Parallel 2'),
      this.trpcService.getGreeting('Parallel 3'),
      this.trpcService.slowQuery(1000),
      this.trpcService.getGreeting('Parallel 4')
    ];

    this.subscriptions.push(
      forkJoin(parallelCalls).subscribe({
        next: (results) => {
          const totalDuration = Date.now() - startTime;
          results.forEach((result, index) => {
            this.batchResults.push({
              type: `Parallel ${index + 1}`,
              message: result.message || 'Call completed',
              duration: totalDuration // All completed at the same time
            });
          });
        },
        error: (error) => {
          this.error = error.message || 'Parallel calls failed';
        }
      })
    );
  }

  /**
   * Clear the current error
   */
  clearError(): void {
    this.error = null;
    this.trpcService.clearError();
  }

  /**
   * Track by function for ngFor
   */
  trackByIndex(index: number): number {
    return index;
  }
} 