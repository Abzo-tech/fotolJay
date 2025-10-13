export enum ProductStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export interface Photo {
  id: string;
  url: string;
  publicId?: string;
  isPrimary: boolean;
  productId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  status: ProductStatus;
  views: number;
  isVip: boolean;
  sellerId: string;
  seller: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isVip: boolean;
  };
  photos: Photo[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

export interface PaginatedResponse<T> {
  products: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
}
