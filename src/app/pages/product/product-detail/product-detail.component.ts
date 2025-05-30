import { Component, OnInit } from '@angular/core';
import { IProductDetailResult } from '../../../models/IProductDetails';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [NgIf],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productDetail: IProductDetailResult | null = null;
  errorMessage: string | null = null;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getIProductDetailResultById(id).subscribe({
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
