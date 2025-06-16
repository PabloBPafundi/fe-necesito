import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { UserService } from '../../shared/services/user.service';
import {
  IArticuloResponse,
  IProductQueryParamsSearch,
} from '../../shared/types/IProductDetails';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Trash,
  PlusCircle,
  PencilLine,
} from 'lucide-angular';

@Component({
  selector: 'app-my-product',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    LucideAngularModule,
  ],
  templateUrl: './my-product.component.html',
})
export class MyProductComponent implements OnInit {
  readonly Trash = Trash;
  readonly PlusCircle = PlusCircle;
  readonly PencilLine = PencilLine;

  products: IArticuloResponse[] = [];
  currentPage = 1;
  itemsPerPage = 24;
  totalPages = 1;

  lastParams: IProductQueryParamsSearch = {
    page: 1,
    maxResults: 24,
  };

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserProduct();
  }

  fetchUserProduct() {
    let params: IProductQueryParamsSearch = {};

    const userId = this.userService.userId();
    if (userId) {
      params = {
        no_arrendador: userId,
        page: this.currentPage,
        maxResults: this.itemsPerPage,
      };
    }

    this.productService.getProductsFiltered(params).subscribe({
      next: (res) => {
        if ('result' in res) {
          this.products = res.result;
          this.totalPages = res.pages;
        } else {
          console.error('Error de respuesta:', res);
          this.products = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.products = [];
      },
    });
  }

  displayedColumns = ['nombre', 'precio', 'activo', 'acciones'];

  onEdit(p: IArticuloResponse) {
    this.router.navigate(['/product', p.id]);
  }

  onDelete(p: IArticuloResponse) {
    if (p.id && confirm('¿Seguro querés eliminarlo?')) {
      this.productService.deleteIProductDetailResult(p.id).subscribe(() => {
        this.fetchUserProduct();
      });
    }
  }

  onNew() {
    this.router.navigate(['/product-advertise']);
  }

  onPageChange(event: PageEvent) {
    this.itemsPerPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.fetchUserProduct();
  }
}
