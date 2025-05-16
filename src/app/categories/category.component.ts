// category.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { Category } from './ICategory.interface';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  standalone: true,
  imports: [NgFor, RouterLink]
})
export class CategoryComponent implements OnInit {
  parentCategories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
       this.parentCategories = response.result.filter(cat => cat.categoria_padre === null);
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
      }
    });
  }
}