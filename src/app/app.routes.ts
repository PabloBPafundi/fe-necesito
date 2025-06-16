// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Necesito.com',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    title: 'Necesito.com',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent),
    children: [
      {
        path: 'sign-in',
        title: 'Necesito.com',
        loadComponent: () => import('./pages/auth/login-form/login-form.component')
          .then(m => m.LoginFormComponent),
      },
      {
        path: 'sign-up',
        title: 'Necesito.com',
        loadComponent: () => import('./pages/auth/register-form/register-form.component')
          .then(m => m.RegisterFormComponent),
      },
    ]
  },
  {
    path: 'profile',
    title: 'Necesito.com',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
  },
  {
    path: 'product-advertise',
    title: 'Necesito.com',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/product/product-advertise/product-advertise.component')
      .then(m => m.ProductAdvertiseComponent),
  },
  {
    path: 'product-status',
    title: 'Necesito.com',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/product-status/product-status.component')
      .then(m => m.ProductStatusComponent),
  },
  {
    path: 'product',
    title: 'Necesito.com',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/product/product.component').then(m => m.ProductComponent),
  },
  {
    path: 'product/:id',
    title: 'Detalle de producto',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/product/product-detail/product-detail.component')
      .then(m => m.ProductDetailComponent),
  },
  {
    path: 'calendar-orders',
    title: 'Calendar Orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/calendar-orders/calendar-orders.component')
      .then(m => m.CalendarOrdersComponent),
  },
  {
    path: '**',
    title: 'Necesito.com',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/product/product-detail/product-detail.component')
      .then(m => m.ProductDetailComponent),
  },
];
