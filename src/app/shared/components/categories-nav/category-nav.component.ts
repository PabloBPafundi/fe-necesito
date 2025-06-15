// category.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/ICategory.interface';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-category',
  templateUrl: './category-nav.component.html',
  standalone: true,
  imports: [NgFor, RouterLink],
})
export class CategoryNavComponent implements OnInit {
  parentCategories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.parentCategories = response.result.filter(
          (cat) => cat.categoria_padre === null
        );
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
      },
    });
  }
  goToCategory(categoriaId: number): void {
    this.router.navigate(['/product'], {
      queryParams: {
        page: 1,
        categoria: categoriaId,
      },
    });
  }
}
