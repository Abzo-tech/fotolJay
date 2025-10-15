import { Component, OnInit, signal, PLATFORM_ID, inject, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { LucideAngularModule, Camera, Search, Eye, Star, Plus, X, Phone, Mail, User, Menu, Palette, Coins } from 'lucide-angular';
import { NoDownloadDirective } from '../../directives/no-download.directive';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, NoDownloadDirective, ThemeSelectorComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  public apiService = inject(ApiService);
  public authService = inject(AuthService);
  private toastService = inject(ToastService);

  readonly Camera = Camera;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly Star = Star;
  readonly Plus = Plus;
  readonly X = X;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly User = User;
  readonly Menu = Menu;
  readonly Palette = Palette;
  readonly Coins = Coins;

  products = signal<Product[]>([]);
  loading = signal<boolean>(false);
  searchTerm = signal<string>('');
  currentPage = signal<number>(1);
  selectedProduct = signal<Product | null>(null);
  showModal = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);

  // Crédits
  showCreditsModal = signal<boolean>(false);
  selectedCreditsAmount = signal<number | null>(null);

  @ViewChild('themeSelector') themeSelector?: ThemeSelectorComponent;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.loading.set(true);
    
    this.apiService.getProducts({
      status: 'APPROVED',
      search: this.searchTerm(),
      page: this.currentPage(),
      limit: 12
    }).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  getPrimaryPhoto(product: Product): string {
    const primary = product.photos.find(p => p.isPrimary);
    return primary?.url || product.photos[0]?.url || '/placeholder.svg';
  }

  viewProduct(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProduct.set(product);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedProduct.set(null);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  openThemeSelector(): void {
    if (this.themeSelector) {
      this.themeSelector.open();
      this.closeMobileMenu(); // Fermer le menu mobile après avoir ouvert le sélecteur
    } else {
      console.error('Theme selector not found');
    }
  }

  // Crédits methods
  openCreditsModal(): void {
    this.showCreditsModal.set(true);
  }

  closeCreditsModal(): void {
    this.showCreditsModal.set(false);
    this.selectedCreditsAmount.set(null);
  }

  selectCreditsAmount(amount: number): void {
    this.selectedCreditsAmount.set(amount);
  }

  buyCredits(): void {
    const amount = this.selectedCreditsAmount();
    if (!amount) return;

    this.authService.buyCredits(amount).then(() => {
      this.toastService.success(`Achat de ${amount} crédits réussi !`);
      this.closeCreditsModal();
    }).catch((error) => {
      this.toastService.error('Erreur lors de l\'achat de crédits');
      console.error('Buy credits error:', error);
    });
  }

  upgradeToVip(): void {
    this.authService.useCreditsForVip().then(() => {
      this.toastService.success('Félicitations ! Vous êtes maintenant VIP !');
      this.closeModal();
    }).catch((error) => {
      this.toastService.error('Erreur lors de la mise à niveau VIP');
      console.error('Upgrade to VIP error:', error);
    });
  }
}
