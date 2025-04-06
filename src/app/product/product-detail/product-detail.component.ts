import { Component, computed, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { IProductDetailResult } from '../interfaces/IProductDetails'
import { ProductService } from '../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-product-detail',
  imports: [NgIf],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  productDetail: IProductDetailResult | null = null;
  errorMessage: string | null = null;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productDetail = product;
        this.errorMessage = null; 
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.productDetail = null; 
      }
    });
  }
}

