import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard.guard';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginFormComponent } from './auth/component/login-form/login-form.component';
import { RegisterFormComponent } from './auth/component/register-form/register-form.component';
import { ProductStatusComponent } from './product-status/product-status.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { provideServerRendering } from '@angular/platform-server';
import { ProductAdvertiseComponent } from './product/product-advertise/product-advertise.component';



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
    },
    
    { path: '**', 
      component: ProductDetailComponent,
      title:'Necesito.com',
      canActivate: [authGuard]    
    },



];
