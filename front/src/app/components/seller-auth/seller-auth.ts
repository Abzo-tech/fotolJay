import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LucideAngularModule, User, Mail, Lock, Phone, Eye, EyeOff, LogIn, UserPlus } from 'lucide-angular';

@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './seller-auth.html',
  styleUrls: ['./seller-auth.css']
})
export class SellerAuthComponent {
  readonly User = User;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Phone = Phone;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly LogIn = LogIn;
  readonly UserPlus = UserPlus;

  isLogin = signal<boolean>(true);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);

  email = signal<string>('');
  password = signal<string>('');
  firstName = signal<string>('');
  lastName = signal<string>('');
  phone = signal<string>('');

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.isLogin.update(v => !v);
    this.errorMessage.set('');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.loading.set(true);

    if (this.isLogin()) {
      this.login();
    } else {
      this.register();
    }
  }

  private login(): void {
    this.apiService.post<any>('/sellers/login', {
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/sell']);
      },
      error: (error: any) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.error || 'Erreur de connexion');
      }
    });
  }

  private register(): void {
    if (!this.firstName() || !this.lastName()) {
      this.loading.set(false);
      this.errorMessage.set('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.apiService.post<any>('/sellers/register', {
      email: this.email(),
      password: this.password(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      phone: this.phone()
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/sell']);
      },
      error: (error: any) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.error || 'Erreur lors de l\'inscription');
      }
    });
  }
}
