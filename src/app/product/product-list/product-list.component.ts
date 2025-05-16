import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { IProductDetailResult } from '../interfaces/IProductDetails';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [NgFor, RouterLink, NgIf]
})
export class ProductListComponent implements OnInit {


constructor(
  private route: ActivatedRoute,
  private productService: ProductService
) {}

products: IProductDetailResult[] = [];

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const category = params['category'] || '';
    const price = params['price'] || '';
    this.fetchProducts(); // ← Llamada real
  });
}


fetchProducts() {
  this.productService.getAllProducts().subscribe({
    next: (res) => {
      this.products = res;
    },
    error: (err) => {
      console.error('Error al cargar productos:', err.message);
    }
  });
}
  currentPage = 1;
  itemsPerPage = 24;

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.products.length / this.itemsPerPage)) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}