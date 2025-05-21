import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product/services/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IStep } from './interfaces/step.interface'
import { IProductDetailResult } from '../product/interfaces/IProductDetails'
import { SlideHomeCapabilitiesComponent } from './slide-home-capabilities/slide-home-capabilities.component';
import { SlideHomeRandomProductsComponent } from './slide-home-random-products/slide-home-random-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, SlideHomeCapabilitiesComponent, SlideHomeRandomProductsComponent],
  templateUrl: './home.component.html',

})
export class HomeComponent {}
