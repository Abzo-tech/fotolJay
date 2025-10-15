import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';
import {
  LucideAngularModule,
  Camera,
  User,
  Eye,
  Home,
  LogOut,
  RefreshCw,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  Calendar,
  Shield,
  X,
} from 'lucide-angular';
import { NoDownloadDirective } from '../../directives/no-download.directive';
import { NotificationService } from '../../services/notification.service';
import { NotificationBellComponent } from '../notification-bell/notification-bell';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    NoDownloadDirective,
    NotificationBellComponent,
    ThemeSelectorComponent,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent implements OnInit {
  readonly Camera = Camera;
  readonly User = User;
  readonly Eye = Eye;
  readonly Home = Home;
  readonly LogOut = LogOut;
  readonly RefreshCw = RefreshCw;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Trash2 = Trash2;
  readonly Clock = Clock;
  readonly Calendar = Calendar;
  readonly Shield = Shield;
  readonly X = X;

  private apiService = inject(ApiService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private toastService = inject(ToastService);

  loading = signal<boolean>(false);
  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  showModal = signal<boolean>(false);
  currentView = signal<'pending' | 'approved'>('pending');

  ngOnInit(): void {
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadPendingProducts();
  }

  loadPendingProducts(): void {
    this.currentView.set('pending');
    this.loading.set(true);

    this.apiService.getPendingProducts().subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.loading.set(false);
        if (error.status === 401) {
          this.authService.logout();
        }
      },
    });
  }

  loadApprovedProducts(): void {
    this.currentView.set('approved');
    this.loading.set(true);

    this.apiService.getProducts({ status: 'APPROVED' }).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.loading.set(false);
        if (error.status === 401) {
          this.authService.logout();
        }
      },
    });
  }

  switchView(view: 'pending' | 'approved'): void {
    if (view === 'pending') {
      this.loadPendingProducts();
    } else {
      this.loadApprovedProducts();
    }
  }

  viewProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedProduct.set(null);
  }

  approveProduct(product: Product): void {
    this.toastService.info('Approbation du produit en cours...');
    this.loading.set(true);
    this.apiService.approveProduct(product.id).subscribe({
      next: () => {
        this.toastService.success('Produit approuvé avec succès');
        this.products.set(this.products().filter((p) => p.id !== product.id));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur approbation produit :', err);
        this.toastService.error("Erreur lors de l'approbation du produit");
        this.loading.set(false);
      },
    });
  }

  rejectProduct(product: Product): void {
    this.toastService.info('Rejet du produit en cours...');
    this.loading.set(true);
    const reason = 'Rejeté par l\'administrateur';
    this.apiService.rejectProduct(product.id, reason).subscribe({
      next: () => {
        this.toastService.success('Produit rejeté avec succès');
        this.products.set(this.products().filter((p) => p.id !== product.id));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur rejet produit :', err);
        this.toastService.error('Erreur lors du rejet du produit');
        this.loading.set(false);
      },
    });
  }

  deleteProduct(product: Product): void {
    this.toastService.warning('Suppression du produit en cours...');
    this.loading.set(true);
    this.apiService.deleteProduct(product.id).subscribe({
      next: () => {
        this.toastService.success('Produit supprimé avec succès');
        this.products.set(this.products().filter((p) => p.id !== product.id));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur suppression produit :', err);
        this.toastService.error('Erreur lors de la suppression du produit');
        this.loading.set(false);
      },
    });
  }

  getPrimaryPhoto(product: Product): string {
    const primary = product.photos.find((p) => p.isPrimary);
    return primary?.url || product.photos[0]?.url || '/placeholder.svg';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getPendingCount(): number {
    return this.products().filter((p) => p.status === 'PENDING').length;
  }

  getApprovedCount(): number {
    return this.products().filter((p) => p.status === 'APPROVED').length;
  }
}
