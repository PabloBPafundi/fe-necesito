import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { IProductDetailResult } from '../../../models/IProductDetails';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [NgFor, RouterLink, NgIf]
})
export class ProductListComponent implements OnInit {

  products: IProductDetailResult[] = [];
  currentPage = 1;
  itemsPerPage = 24;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // Puedes usar params['category'] o ['price'] para filtrar, si lo deseas
      this.fetchProducts();
    });
  }

  fetchProducts() {
    this.productService.getIProductDetailResults({
      page: this.currentPage,
      maxResults: this.itemsPerPage
    }).subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err.message);
      }
    });
  }

  nextPage() {
    this.currentPage++;
    this.fetchProducts();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProducts();
    }
  }

  get paginatedProducts() {
    return this.products;
  }
}
