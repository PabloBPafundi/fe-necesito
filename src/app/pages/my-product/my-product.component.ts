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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

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
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchUserProduct();
  }

  fetchUserProduct() {
    let params: IProductQueryParamsSearch = {};

    const userId = this.userService.userId();
    if (userId) {
      params = {
        arrendador: userId,
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

  displayedColumns = ['imagen', 'nombre', 'precio', 'activo', 'acciones'];

  getProductThumbnail(product: IArticuloResponse): string {
    const rawData = product.imagenes?.[0]?.data;
    if (!rawData) {
      return 'https://placehold.co/64x64/E0E0E0/666666?text=No+Image';
    }
    const isEscapedUrl = rawData.startsWith('https:\\');
    if (isEscapedUrl) {
      return rawData.replace('\\', '');
    }
    const isUrl = rawData.startsWith('http://') || rawData.startsWith('https://');
    return isUrl ? rawData : `data:image/jpeg;base64,${rawData}`;
  }

  onEdit(p: IArticuloResponse) {
    this.router.navigate(['/product/edit', p.id]);
  }

  onDelete(p: IArticuloResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '¿Estás seguro?',
        message: `Vas a eliminar el producto "${p.nombre}". Esta acción no se puede deshacer.`,
      },
      panelClass: 'rounded-xl',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && p.id) {
        this.productService.deleteIProductDetailResult(p.id).subscribe(() => {
          this.fetchUserProduct();
        });
      }
    });
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
