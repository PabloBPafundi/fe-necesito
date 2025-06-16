import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import { Subscription, filter } from 'rxjs';
import { CategoryNavComponent } from './shared/components/categories-nav/category-nav.component';
import { BackToTopButtonComponent } from './shared/components/back-to-top-button/back-to-top-button.component';
import { UserService } from './shared/services/user.service';



@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavBarComponent,
    FooterComponent,
    NgIf,
    NgClass,
    CategoryNavComponent,
    BackToTopButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthScreen: boolean = false;
  private routerSubscription!: Subscription;
  userIsLogIn: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {

    this.isAuthScreen = this.router.url === '/auth';

    this.userIsLogIn = this.authService.isAuthenticated();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
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
