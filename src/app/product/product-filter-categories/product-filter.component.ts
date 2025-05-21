import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../categories/category.service';
import { ProductService } from '../services/product.service'; // Importa tu ProductService
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngFor
import { Category } from '../../categories/ICategory.interface';
import { FilterProductService } from '../services/filter.service';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-filter.component.html',
})
export class ProductFilterComponent implements OnInit {
  categories: Category[] = [];
  localidades: { id: number; nombre: string; codigo_postal: string }[] = [];
  provincias: { id: number; nombre: string }[] = [];
  errorMessage: string = '';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private filterProductService: FilterProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadLocalidades();
    this.loadProvincias();
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

  loadLocalidades(): void {
    this.filterProductService.getLocalidades().subscribe({
      next: (localidades) => {
        this.localidades = localidades;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las localidades.';
        console.error('Error cargando localidades', err);
      },
    });
  }

  loadProvincias(): void {
    this.filterProductService.getProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las provincias.';
        console.error('Error cargando provincias', err);
      },
    });
  }

  // Métodos para manejar la selección de filtros (puedes agregarlos aquí)
  onCategorySelected(category: Category): void {
    console.log('Categoría seleccionada:', category);
    // Aquí puedes implementar la lógica para filtrar productos por categoría
  }

  onLocalidadSelected(localidad: { id: number; nombre: string; codigo_postal: string }): void {
    console.log('Localidad seleccionada:', localidad);
    // Aquí puedes implementar la lógica para filtrar productos por localidad
  }

  onProvinciaSelected(provincia: { id: number; nombre: string }): void {
    console.log('Provincia seleccionada:', provincia);
    // Aquí puedes implementar la lógica para filtrar productos por provincia
  }
}

