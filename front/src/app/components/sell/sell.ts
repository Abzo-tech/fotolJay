import {
  Component,
  signal,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { LucideAngularModule, Camera, X, AlertCircle, CheckCircle, User, LogIn, Home, LogOut, Menu, Palette, LayoutDashboard, Package, Plus, Edit, Trash2, Calendar, Eye, Save, Image } from 'lucide-angular';
import { z } from 'zod';
import { Product, ProductStatus } from '../../models/product.model';

const productSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  photos: z
    .array(z.any())
    .min(1, 'Au moins une photo est requise')
    .max(5, 'Maximum 5 photos autorisées'),
  sellerFirstName: z
    .string()
    .min(1, 'Le prénom du vendeur est requis')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  sellerLastName: z
    .string()
    .min(1, 'Le nom du vendeur est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  sellerEmail: z
    .string()
    .min(1, 'L\'email du vendeur est requis')
    .email('Format d\'email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  sellerPhone: z
    .string()
    .max(20, 'Le téléphone ne peut pas dépasser 20 caractères')
    .optional(),
});

@Component({
  selector: 'app-sell',
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './sell.html',
  styleUrls: ['./sell.css'],
})
export class SellComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  readonly Camera = Camera;
  readonly X = X;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly User = User;
  readonly LogIn = LogIn;
  readonly Home = Home;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly Palette = Palette;
  readonly LayoutDashboard = LayoutDashboard;
  readonly Package = Package;
  readonly Plus = Plus;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Calendar = Calendar;
  readonly Eye = Eye;
  readonly Save = Save;
  readonly Image = Image;

  isAuthenticated = signal<boolean>(false);
  currentUser = signal<any>(null);

  photos = signal<File[]>([]);
  photoPreviewUrls = signal<string[]>([]);
  maxPhotos = 5;

  title = signal<string>('');
  description = signal<string>('');

  // Informations vendeur (éditables)
  sellerFirstName = signal<string>('');
  sellerLastName = signal<string>('');
  sellerEmail = signal<string>('');
  sellerPhone = signal<string>('');

  submitting = signal<boolean>(false);
  showCamera = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);
  currentView = signal<'sell' | 'dashboard' | 'profile'>('sell');
  sellerProducts = signal<Product[]>([]);
  stream: MediaStream | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        // Vérifier la validité du token côté serveur
        this.apiService.getCurrentUser().subscribe({
          next: (userData) => {
            this.isAuthenticated.set(true);
            this.currentUser.set(userData);

            // Initialiser les informations vendeur avec les données utilisateur
            this.sellerFirstName.set(userData.firstName || '');
            this.sellerLastName.set(userData.lastName || '');
            this.sellerEmail.set(userData.email || '');
            this.sellerPhone.set('');

            // Charger les produits du vendeur
            this.loadSellerProducts();
          },
          error: () => {
            // Token invalide ou expiré
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.toastService.warning('Votre session a expiré. Veuillez vous reconnecter.');
            this.router.navigate(['/seller-auth']);
          }
        });
      } else {
        this.toastService.warning('Vous devez être connecté pour accéder à votre espace vendeur');
        this.router.navigate(['/seller-auth']);
      }
    }
  }

  ngOnDestroy(): void {
    this.closeCamera();
  }

  setView(view: 'sell' | 'dashboard' | 'profile'): void {
    this.currentView.set(view);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  loadSellerProducts(): void {
    this.apiService.getSellerProducts().subscribe({
      next: (products: Product[]) => {
        this.sellerProducts.set(products);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.toastService.error('Erreur lors du chargement de vos produits');
      }
    });
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getActiveProductsCount(): number {
    return this.sellerProducts().filter(p => p.status === ProductStatus.APPROVED).length;
  }

  getTotalViews(): number {
    return this.sellerProducts().reduce((total, product) => total + (product.views || 0), 0);
  }

  resetForm(): void {
    this.title.set('');
    this.description.set('');
    this.photos.set([]);
    this.photoPreviewUrls.set([]);
    this.toastService.info('Formulaire réinitialisé');
  }

  updateProfile(): void {
    // Ici on pourrait implémenter la mise à jour du profil vendeur
    this.toastService.success('Profil mis à jour avec succès');
  }

  editProduct(product: Product): void {
    // Ici on pourrait implémenter l'édition d'un produit
    this.toastService.info('Fonctionnalité d\'édition à venir');
  }

  deleteProduct(product: Product): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.title}" ?`)) {
      // Temporairement désactivé jusqu'à implémentation de l'API
      this.toastService.info('Fonctionnalité de suppression à venir');
    }
  }

  async openCamera(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.photos().length >= this.maxPhotos) {
      this.toastService.warning(`Maximum ${this.maxPhotos} photos autorisées`);
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      this.showCamera.set(true);

      setTimeout(() => {
        if (this.videoElement?.nativeElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
        }
      }, 100);
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      this.toastService.error(
        "Impossible d'accéder à la caméra. Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur."
      );
    }
  }

  capturePhoto(): void {
    if (!this.videoElement?.nativeElement || !this.canvasElement?.nativeElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });

          const newPhotos = [...this.photos(), file];
          this.photos.set(newPhotos);

          const reader = new FileReader();
          reader.onload = (e) => {
            const newUrls = [...this.photoPreviewUrls(), e.target?.result as string];
            this.photoPreviewUrls.set(newUrls);
          };
          reader.readAsDataURL(file);

          this.closeCamera();
        }
      },
      'image/jpeg',
      0.9
    );
  }

  closeCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      this.stream = null;
    }
    this.showCamera.set(false);
  }

  removePhoto(index: number): void {
    const photos = this.photos().filter((_, i) => i !== index);
    const urls = this.photoPreviewUrls().filter((_, i) => i !== index);
    this.photos.set(photos);
    this.photoPreviewUrls.set(urls);
  }

  onSubmit(): void {
    const validationResult = productSchema.safeParse({
      title: this.title(),
      description: this.description(),
      photos: this.photos(),
      sellerFirstName: this.sellerFirstName(),
      sellerLastName: this.sellerLastName(),
      sellerEmail: this.sellerEmail(),
      sellerPhone: this.sellerPhone(),
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      this.toastService.error(firstError.message);
      return;
    }

    // Vérifier que l'utilisateur est toujours authentifié
    if (!this.isAuthenticated()) {
      this.toastService.error('Vous devez être connecté pour publier un produit');
      this.router.navigate(['/seller-auth']);
      return;
    }

    this.submitting.set(true);

    const formData = new FormData();
    formData.append('title', this.title());
    formData.append('description', this.description());

    // Ajouter les informations vendeur
    formData.append('sellerFirstName', this.sellerFirstName());
    formData.append('sellerLastName', this.sellerLastName());
    formData.append('sellerEmail', this.sellerEmail());
    formData.append('sellerPhone', this.sellerPhone());

    this.photos().forEach((photo) => {
      formData.append('photos', photo);
    });

    this.apiService.createProduct(formData).subscribe({
      next: () => {
        this.toastService.success('Produit publié avec succès! Il sera visible après modération.');
        this.resetForm();
        // Recharger les produits pour mettre à jour le dashboard
        this.loadSellerProducts();
        // Basculer vers le dashboard pour voir le nouveau produit
        this.setView('dashboard');
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.toastService.error(
          'Erreur lors de la publication: ' + (error.error?.error || error.message)
        );
        this.submitting.set(false);
      },
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.toastService.success('Déconnexion réussie');
      this.router.navigate(['/']);
    }
  }
}
