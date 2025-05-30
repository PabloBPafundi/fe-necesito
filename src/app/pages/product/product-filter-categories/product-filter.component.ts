import { Component, NgModule, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service'; // Importa tu ProductService
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngFor
import { Category } from '../../../models/ICategory.interface';
import { FilterProductService } from '../../../services/FilterProduct.service';
import { FormsModule } from '@angular/forms';

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
    private filterProductService: FilterProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
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
    console.log('Categorías seleccionadas:', this.selectedCategories);
    // Aquí puedes llamar a un método para filtrar productos con los filtros actuales
  }

  onPriceRangeSelected(min: number, max: number): void {
    this.selectedPriceRange = { min, max };
    console.log('Rango de precios seleccionado:', this.selectedPriceRange);
    // Aquí también puedes filtrar productos según el rango
  }
}