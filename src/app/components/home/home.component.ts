import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TrpcService } from '../../services/trpc.service';
import { GreetingResponse } from '../../shared/types';
import { Subscription } from 'rxjs';

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
   * Clear the current error
   */
  clearError(): void {
    this.error = null;
    this.trpcService.clearError();
  }
} 