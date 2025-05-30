import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit, OnDestroy {
  showIndexAuth: boolean | null = null;
  private routerSubscription!: Subscription; 

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.showIndexAuth = this.router.url === '/auth'
  
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showIndexAuth = event.url === '/auth' || event.url === '/auth/';
      });
  }




  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}