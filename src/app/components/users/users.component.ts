import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrpcService } from '../../services/trpc.service';
import { User, CreateUserInput, UpdateUserInput } from '../../shared/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: (User & { isEditing?: boolean; editedName?: string; editedEmail?: string; editedAge?: number })[] = [];
  newUser: CreateUserInput = { name: '', email: '', age: 0 };
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

    // Load users on component initialization
    this.loadUsers();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load all users from the tRPC server
   */
  loadUsers(): void {
    this.subscriptions.push(
      this.trpcService.getUsers().subscribe({
        next: (users) => {
          this.users = users.map(user => ({
            ...user,
            isEditing: false,
            editedName: user.name,
            editedEmail: user.email,
            editedAge: user.age
          }));
        },
        error: (error) => {
          this.error = error.message || 'Failed to load users';
        }
      })
    );
  }

  /**
   * Create a new user
   */
  createUser(): void {
    if (!this.newUser.name || !this.newUser.email || this.newUser.age <= 0) {
      this.error = 'Please fill in all fields with valid values';
      return;
    }

    this.subscriptions.push(
      this.trpcService.createUser(this.newUser).subscribe({
        next: (user) => {
          // Add the new user to the list
          this.users.push({
            ...user,
            isEditing: false,
            editedName: user.name,
            editedEmail: user.email,
            editedAge: user.age
          });
          
          // Reset the form
          this.newUser = { name: '', email: '', age: 0 };
        },
        error: (error) => {
          this.error = error.message || 'Failed to create user';
        }
      })
    );
  }

  /**
   * Start editing a user
   */
  startEdit(user: User & { isEditing?: boolean; editedName?: string; editedEmail?: string; editedAge?: number }): void {
    user.isEditing = true;
    user.editedName = user.name;
    user.editedEmail = user.email;
    user.editedAge = user.age;
  }

  /**
   * Save user edits
   */
  saveEdit(user: User & { isEditing?: boolean; editedName?: string; editedEmail?: string; editedAge?: number }): void {
    if (!user.editedName || !user.editedEmail || !user.editedAge || user.editedAge <= 0) {
      this.error = 'Please fill in all fields with valid values';
      return;
    }

    const updateData: UpdateUserInput = {
      id: user.id,
      name: user.editedName,
      email: user.editedEmail,
      age: user.editedAge
    };

    this.subscriptions.push(
      this.trpcService.updateUser(updateData).subscribe({
        next: (updatedUser) => {
          // Update the user in the list
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = {
              ...updatedUser,
              isEditing: false,
              editedName: updatedUser.name,
              editedEmail: updatedUser.email,
              editedAge: updatedUser.age
            };
          }
        },
        error: (error) => {
          this.error = error.message || 'Failed to update user';
        }
      })
    );
  }

  /**
   * Cancel user editing
   */
  cancelEdit(user: User & { isEditing?: boolean; editedName?: string; editedEmail?: string; editedAge?: number }): void {
    user.isEditing = false;
    user.editedName = user.name;
    user.editedEmail = user.email;
    user.editedAge = user.age;
  }

  /**
   * Clear the current error
   */
  clearError(): void {
    this.error = null;
    this.trpcService.clearError();
  }
} 