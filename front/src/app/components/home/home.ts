import { Component, OnInit, signal, PLATFORM_ID, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, NoDownloadDirective],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
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
  topProducts = signal<Product[]>([]);
  loading = signal<boolean>(false);
  searchTerm = signal<string>('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  currentPage = signal<number>(1);
  selectedProduct = signal<Product | null>(null);
  showModal = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);

  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;
  private autoScrollInterval: ReturnType<typeof setInterval> | undefined;
  private vipPage = 1;
  private cardWidth = 300; // Approximate card width including gap



  @ViewChild('themeSelector') themeSelector?: ThemeSelectorComponent;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
      this.loadTopProducts();
    }
  }

  ngAfterViewInit(): void {
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  loadProducts(): void {
    this.loading.set(true);

    this.apiService.getProducts({
      status: 'APPROVED',
      search: this.searchTerm(),
      minPrice: this.minPrice() ?? undefined,
      maxPrice: this.maxPrice() ?? undefined,
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

  loadTopProducts(): void {
    this.apiService.getProducts({
      status: 'APPROVED',
      isVip: true,
      sortBy: 'views',
      sortOrder: 'desc',
      limit: 10,
      page: this.vipPage
    }).subscribe({
      next: (response) => {
        this.topProducts.update(current => [...current, ...response.products]);
      },
      error: (error) => {
        console.error('Erreur chargement produits VIP:', error);
      }
    });
  }

  loadMoreVIP(): void {
    this.vipPage++;
    this.loadTopProducts();
  }

  private startAutoScroll(): void {
    if (!this.carousel) return;

    this.autoScrollInterval = setInterval(() => {
      if (this.carousel.nativeElement) {
        const scrollLeft = this.carousel.nativeElement.scrollLeft;
        const maxScroll = this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth;
        this.carousel.nativeElement.scrollTo({
          left: scrollLeft + this.cardWidth,
          behavior: 'smooth'
        });
        if (scrollLeft + this.cardWidth >= maxScroll) {
          setTimeout(() => {
            this.carousel.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
          }, 500);
        }
      }
    }, 3000);
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



  upgradeToVip(): void {
    const product = this.selectedProduct();
    if (!product) return;

    this.apiService.upgradeProductToVip(product.id).subscribe({
      next: (_response) => {
        this.toastService.success('Produit mis à niveau VIP avec succès !');
        this.closeModal();
        // Refresh products to show updated status
        this.loadProducts();
      },
      error: (error) => {
        this.toastService.error('Erreur lors de la mise à niveau VIP');
        console.error('Upgrade to VIP error:', error);
      }
    });
  }

  onPriceFilter(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  clearPriceFilter(): void {
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.currentPage.set(1);
    this.loadProducts();
  }
}
