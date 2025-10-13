import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Shield, AlertCircle, Lock, Eye, EyeOff, ArrowLeft, Mail, Camera } from 'lucide-angular';
import { loginSchema } from '../../schemas/login.schema';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  readonly ArrowRight = ArrowRight;
  readonly Shield = Shield;
  readonly AlertCircle = AlertCircle;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly ArrowLeft = ArrowLeft;
  readonly Mail = Mail;
  readonly Camera = Camera;

  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal<string>('');
  password = signal<string>('');
  showPassword = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string>('');
  validationErrors = signal<{[key: string]: string}>({});

  async onSubmit(): Promise<void> {
    // Réinitialiser les erreurs
    this.validationErrors.set({});
    this.error.set('');
    const validationResult = loginSchema.safeParse({
      email: this.email(),
      password: this.password()
    });

    if (!validationResult.success) {
      const errors: {[key: string]: string} = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      this.validationErrors.set(errors);

      // Afficher la première erreur comme erreur générale
      const firstError = validationResult.error.errors[0];
      if (firstError) {
        this.error.set(firstError.message);
      }
      return;
    }

    this.loading.set(true);

    try {
      // Essaie d'abord la connexion vendeur
      try {
        await this.authService.sellerLogin(this.email(), this.password());
      } catch (sellerError) {
        // Si la connexion vendeur échoue, essaie la connexion normale (admin/modérateur)
        await this.authService.login(this.email(), this.password());
      }

      // Rediriger vers la page appropriée selon le rôle
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error: unknown) {
      const errorMessage = this.getErrorMessage(error);
      this.error.set(errorMessage);
      this.loading.set(false);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'error' in error) {
      const httpError = error as { error?: { error?: string } };
      return httpError.error?.error || 'Email ou mot de passe incorrect';
    }
    return 'Email ou mot de passe incorrect';
  }

  getFieldError(field: string): string {
    return this.validationErrors()[field] || '';
  }

  hasFieldError(field: string): boolean {
    return !!this.validationErrors()[field];
  }

  validateField(field: string, value: string): void {
    try {
      // Validation individuelle du champ
      if (field === 'email') {
        loginSchema.pick({ email: true }).parse({ email: value });
      } else if (field === 'password') {
        loginSchema.pick({ password: true }).parse({ password: value });
      }

      // Supprimer l'erreur pour ce champ si elle existe
      this.validationErrors.update(errors => {
        const newErrors = { ...errors };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error: any) {
      if (error.errors && error.errors[0]) {
        this.validationErrors.update(errors => ({
          ...errors,
          [field]: error.errors[0].message
        }));
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }
}
