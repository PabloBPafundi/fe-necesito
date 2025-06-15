import { Component, NgModule, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { ProductService } from '../../../shared/services/product.service';
import { CommonModule } from '@angular/common';
import { Category } from '../../../shared/types/ICategory.interface';
import { FilterProductService } from '../../../shared/services/FilterProduct.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.component.html',
})
export class ProductFilterComponent implements OnInit {
  categories: Category[] = [];
  errorMessage: string = '';

  selectedCategories: number[] = [];
  selectedPriceRange: { min: number; max: number } | null = null;

  minPrice: number | null = null;
  maxPrice: number | null = null;

  Infinity = Infinity;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private filterProductService: FilterProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.route.queryParamMap.subscribe((params) => {
      const categoriasParam = params.get('categoria');
      if (categoriasParam) {
        this.selectedCategories = categoriasParam
          .split(',')
          .map((id) => Number(id))
          .filter((id) => !isNaN(id));
      }

      const precioMin = params.get('precioMin');
      const precioMax = params.get('precioMax');
      if (precioMin) this.minPrice = +precioMin;
      if (precioMax) this.maxPrice = +precioMax;
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.result;
        } else {
          this.errorMessage = 'Error al cargar las categorías.';
          console.error('Error cargando categorías', response);
        }
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las categorías.';
        console.error('Error cargando categorías', err);
      },
    });
  }

  onCategorySelected(category: Category): void {
    const index = this.selectedCategories.indexOf(category.id);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category.id);
    }

    const queryParams: any = {
      page: 1,
      categoria:
        this.selectedCategories.length > 0
          ? this.selectedCategories.join(',')
          : null, // Esto borra el parámetro de la URL
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onPriceRangeSelected(min: number, max: number): void {
    this.selectedPriceRange = { min, max };

    const queryParams: any = {
      page: 1,
    };

    if (min != null && !isNaN(min)) {
      queryParams['precioMin'] = min;
    }

    if (max != null && isFinite(max)) {
      queryParams['precioMax'] = max;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
