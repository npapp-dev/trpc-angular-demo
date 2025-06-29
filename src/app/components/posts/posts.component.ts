import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrpcService } from '../../services/trpc.service';
import { Post } from '../../shared/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
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

    // Load posts on component initialization
    this.loadPosts();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load all posts with user information from the tRPC server
   */
  loadPosts(): void {
    this.subscriptions.push(
      this.trpcService.getPosts().subscribe({
        next: (posts) => {
          this.posts = posts;
        },
        error: (error) => {
          this.error = error.message || 'Failed to load posts';
        }
      })
    );
  }

  /**
   * Get unique users from posts
   */
  get uniqueUsers() {
    const userIds = new Set(this.posts.map(post => post.userId));
    return Array.from(userIds);
  }

  /**
   * Calculate average age of post authors
   */
  get averageAge() {
    const usersWithAge = this.posts
      .map(post => post.user?.age)
      .filter(age => age !== undefined && age > 0);
    
    if (usersWithAge.length === 0) return 0;
    
    const sum = usersWithAge.reduce((acc, age) => acc + age!, 0);
    return sum / usersWithAge.length;
  }

  /**
   * Clear the current error
   */
  clearError(): void {
    this.error = null;
    this.trpcService.clearError();
  }
} 