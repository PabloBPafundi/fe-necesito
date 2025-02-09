import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard.guard';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginFormComponent } from './auth/component/login-form/login-form.component';
import { RegisterFormComponent } from './auth/component/register-form/register-form.component';
import { ProductStatusComponent } from './product-status/product-status.component';


export const routes: Routes = [

    { path: '', 
        component: HomeComponent,
        title:'Necesito.com',
        canActivate: [authGuard]    
    },


    { path: 'auth', 
        component: AuthComponent,
         canActivate: [authGuard],
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


    { path: 'product-status', 
      component: ProductStatusComponent,
      title:'Necesito.com',
      canActivate: [authGuard]    
  },


];
