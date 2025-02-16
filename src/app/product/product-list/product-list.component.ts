import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [NgFor, RouterLink]
})
export class ProductListComponent implements OnInit {


  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const category = params['category'] || ''; 
      const price = params['price'] || ''; 

      //this.fetchProducts(category, price);
    });
  }
  products = Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    name: `Producto ${i + 1}`,
    price: (Math.random() * 100).toFixed(2),
    image: 'img.png'
  }));

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