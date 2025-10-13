import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.checkAuth();
    }
  }

  private checkAuth(): void {
    if (!this.isBrowser) return;
    
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.login(email, password).subscribe({
        next: (response: any) => {
          if (this.isBrowser) {
            localStorage.setItem('token', response.token);
          }
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
          resolve();
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

  sellerLogin(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.sellerLogin(email, password).subscribe({
        next: (response: any) => {
          if (this.isBrowser) {
            localStorage.setItem('token', response.token);
          }
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
          resolve();
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  isModerator(): boolean {
    const role = this.currentUser()?.role;
    return role === 'MODERATOR' || role === 'ADMIN';
  }
}
