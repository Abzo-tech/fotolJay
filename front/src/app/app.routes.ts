import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { SellComponent } from './components/sell/sell';
import { LoginComponent } from './components/login/login';
import { AdminComponent } from './components/admin/admin';
import { SellerAuthComponent } from './components/seller-auth/seller-auth';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sell', component: SellComponent },
  { path: 'seller-auth', component: SellerAuthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
