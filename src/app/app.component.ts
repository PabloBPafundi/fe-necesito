import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from './auth/services/auth.service';
import { Subscription, filter } from 'rxjs'


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, FooterComponent, NgIf, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthScreen: boolean | null = null;
  private routerSubscription!: Subscription; 
  
 constructor(public authService: AuthService, private router: Router){}
ngOnInit(): void {

    this.authService.isAuthenticated.set(true)


    this.isAuthScreen = this.router.url === '/auth'

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAuthScreen = event.url.startsWith('/auth');

      });




}

ngOnDestroy(): void {
  if (this.routerSubscription) {
    this.routerSubscription.unsubscribe();
  }

}

}
