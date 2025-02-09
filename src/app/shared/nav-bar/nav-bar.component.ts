import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule,  LogOut, User, ShoppingCart, ChevronDown, Info} from 'lucide-angular';

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
  

  isLoggedIn: boolean = false;  
  userName: string = '';
  dropdownOpen: boolean = false;  
  ngOnInit(): void {

    this.isLoggedIn = true;  
    this.userName = 'Juan Pérez';  
  }

  logout(){}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

}


