import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard.guard';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginFormComponent } from './pages/auth/login-form/login-form.component';
import { RegisterFormComponent } from './pages/auth/register-form/register-form.component';
import { ProductStatusComponent } from './pages/product-status/product-status.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductDetailComponent } from './pages/product/product-detail/product-detail.component';
import { provideServerRendering } from '@angular/platform-server';
import { ProductAdvertiseComponent } from './pages/product/product-advertise/product-advertise.component';
import { CalendarOrdersComponent } from './pages/calendar-orders/calendar-orders.component';



export const routes: Routes = [

    { path: 'home', 
        component: HomeComponent,
        title:'Necesito.com',
        canActivate: [authGuard]    
    },

    { path: '', 
      component: HomeComponent,
      title:'Necesito.com',
      canActivate: [authGuard]    
    },

    { path: 'auth', 
        component: AuthComponent,
         title:'Necesito.com',
         children: [
           {
             path: 'sign-in', 
             title:'Necesito.com',
             component: LoginFormComponent, 
           },
           {
             path: 'sign-up', 
             title:'Necesito.com',
             component: RegisterFormComponent,
             
           },
         ]
    },

    { path: 'profile', 
        component: ProfileComponent,
        title:'Necesito.com',
        canActivate: [authGuard]    
    },

       { path: 'product-advertise', 
        component: ProductAdvertiseComponent,
        title:'Necesito.com',
        canActivate: [authGuard]    
    },


    { path: 'product-status', 
      component: ProductStatusComponent,
      title:'Necesito.com',
      canActivate: [authGuard]    
    },


    { path: 'product', 
      component: ProductComponent,
      title:'Necesito.com',
      canActivate: [authGuard]    
    },


    {
      path: 'product/:id',
      component: ProductDetailComponent,
      title: 'Detalle de producto',
       canActivate: [authGuard]
    },


    {
      path: 'calendar-orders',
      component: CalendarOrdersComponent,
      title: 'Calendar Orders',
       canActivate: [authGuard]
    },



    
    
    { path: '**', 
      component: ProductDetailComponent,
      title:'Necesito.com',
      canActivate: [authGuard]    
    },



];
