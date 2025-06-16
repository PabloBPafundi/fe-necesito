import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import {
  IArticuloResponse,
  IProductQueryParamsSearch,
} from '../../../shared/types/IProductDetails';
import { parseActivo } from '../../../shared/utils/parseActivo';
import { UserService } from '../../../shared/services/user.service';
import {
  getBase64ImageUrl,
  isBase64Image,
} from '../../../shared/utils/getImageType';
import { cleanEscapedUrl } from '../../../shared/utils/cleanEscapedUrl';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [NgFor, RouterLink],
})
export class ProductListComponent implements OnInit {
  products: IArticuloResponse[] = [];
  currentPage = 1;
  itemsPerPage = 24;
  totalPages = 1;

  lastParams: IProductQueryParamsSearch = {
    page: 1,
    maxResults: 24,
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      this.itemsPerPage = +params['maxResults'] || 24;

      // Guardamos los parámetros convertidos en la interfaz
      this.lastParams = {
        page: this.currentPage,
        maxResults: this.itemsPerPage,
        sort: params['sort'],
        nombre: params['nombre'],
        descripcion: params['descripcion'],
        activo: parseActivo(params['activo']),
        categoria:
          params['categoria'] !== undefined
            ? params['categoria'].split(',').map((id: string) => +id)
            : undefined,
        arrendador:
          params['arrendador'] !== undefined
            ? +params['arrendador']
            : undefined,
        precioMin:
          params['precioMin'] !== undefined ? +params['precioMin'] : undefined,
        precioMax:
          params['precioMax'] !== undefined ? +params['precioMax'] : undefined,
      };

      this.fetchProducts(this.lastParams);
    });
  }

  fetchProducts(params: IProductQueryParamsSearch) {
    const userId = this.userService.userId();

    if (userId !== null && userId !== undefined) {
      params = {
        ...params,
        no_arrendador: userId,
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

  getProductImage(product: IArticuloResponse): string {
    const rawData = product.imagenes?.[0]?.data;

    if (!rawData) {
      return 'https://placehold.co/400x300/E0E0E0/666666?text=No+Image';
    }

    const isProbablyEscapedUrl = rawData.startsWith('https:\\');

    if (isProbablyEscapedUrl) {
      return cleanEscapedUrl(rawData);
    }

    const isUrl =
      rawData.startsWith('http://') || rawData.startsWith('https://');

    return isUrl ? rawData : `data:image/jpeg;base64,${rawData}`;
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.lastParams.page = this.currentPage;
      this.fetchProducts(this.lastParams);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.lastParams.page = this.currentPage;
      this.fetchProducts(this.lastParams);
    }
  }

  get paginatedProducts() {
    return this.products;
  }
}
