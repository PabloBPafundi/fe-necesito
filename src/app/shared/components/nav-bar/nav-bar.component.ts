import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule,  LogOut, User, ShoppingCart, ChevronDown, Info, Package, Calendar} from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-nav-bar',
  imports: [LucideAngularModule, NgIf, RouterLink, NgClass, SearchBarComponent],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {

  readonly Calendar = Calendar;
  readonly LogOut = LogOut;
  readonly ChevronDown = ChevronDown;
  readonly User = User;
  readonly ShoppingCart = ShoppingCart;
  readonly Info = Info;
  readonly Package = Package;

  constructor( private userService: UserService, private authService: AuthService) { }
  
  isLoggedIn: boolean = false;  
  dropdownOpen: boolean = false;  

  ngOnInit(): void {
    this.isUserLogIn();
  }



  getUserName() :string | null {
    return this.userService.userName()
  }

  isUserLogIn() :void {
    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
    }
  }


  logout(){
    this.authService.logout();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

}


