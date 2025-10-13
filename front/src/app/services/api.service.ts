import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, PaginatedResponse, LoginResponse, User } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor(private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getHeaders(includeAuth = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (includeAuth && this.isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  // ==================== PRODUITS (PUBLIC) ====================

  getProducts(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Product>> {
    const params: Record<string, string> = {};
    if (filters) {
      if (filters.status) params['status'] = filters.status;
      if (filters.search) params['search'] = filters.search;
      if (filters.page) params['page'] = filters.page.toString();
      if (filters.limit) params['limit'] = filters.limit.toString();
    }

    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(formData: FormData): Observable<Product> {
    let headers = new HttpHeaders();
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return this.http.post<Product>(`${this.apiUrl}/products`, formData, { headers });
  }

  // ==================== AUTHENTIFICATION ====================

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      { email, password },
      { headers: this.getHeaders() }
    );
  }

  // ==================== AUTHENTIFICATION VENDEUR ====================

  sellerLogin(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/sellers/login`,
      { email, password },
      { headers: this.getHeaders() }
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/auth/me`, {
      headers: this.getHeaders(true)
    }).pipe(
      map(response => response.user)
    );
  }

  // ==================== MODÉRATION (ADMIN/MODERATOR) ====================

  getPendingProducts(page = 1, limit = 20): Observable<PaginatedResponse<Product>> {
    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiUrl}/products/moderation/pending?page=${page}&limit=${limit}`,
      { headers: this.getHeaders(true) }
    );
  }

  approveProduct(id: string): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiUrl}/products/${id}/approve`,
      {},
      { headers: this.getHeaders(true) }
    );
  }

  rejectProduct(id: string, reason?: string): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiUrl}/products/${id}/reject`,
      { reason },
      { headers: this.getHeaders(true) }
    );
  }

  // ==================== PRODUITS VENDEUR ====================

  getSellerProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/seller`, {
      headers: this.getHeaders(true)
    });
  }

  post<T>(endpoint: string, body: any, includeAuth = false): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, {
      headers: this.getHeaders(includeAuth)
    });
  }

  get<T>(endpoint: string, includeAuth = false): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.getHeaders(includeAuth)
    });
  }
}
