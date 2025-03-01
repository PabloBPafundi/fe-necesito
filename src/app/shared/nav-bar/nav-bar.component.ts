import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule,  LogOut, User, ShoppingCart, ChevronDown, Info} from 'lucide-angular';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-nav-bar',
  imports: [LucideAngularModule, NgIf, RouterLink, NgClass],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {


  readonly LogOut = LogOut;
  readonly ChevronDown = ChevronDown;
  readonly User = User;
  readonly ShoppingCart = ShoppingCart;
  readonly Info = Info;


  constructor( private userService: UserService, private authService: AuthService) { }
  

  isLoggedIn: boolean = false;  
   
  dropdownOpen: boolean = false;  


  getUserName() :string | null {
    return this.userService.userName()
  }

  isUserLogIn() :void {
    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
    }
  }


  ngOnInit(): void {

    this.isLoggedIn = true;  

  }

  logout(){
    this.authService.logout();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

}


