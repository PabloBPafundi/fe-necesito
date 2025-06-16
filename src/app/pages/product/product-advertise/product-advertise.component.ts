import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { UserService } from '../../../shared/services/user.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CategoryService } from '../../../shared/services/category.service';
import { Observable } from 'rxjs';
import { ICategoryResponse } from '../../../shared/types/ICategory.interface';
import { ICreateProduct } from '../../../shared/types/IProductDetails';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LucideAngularModule, UploadCloud } from 'lucide-angular';
import { AsyncPipe, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-advertise',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    LucideAngularModule,
    AsyncPipe,
    NgFor,
  ],
  templateUrl: './product-advertise.component.html',
})
export class ProductAdvertiseComponent implements OnInit {
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  readonly UploadCloud = UploadCloud;
  private router = inject(Router);

  form!: FormGroup;
  categories$!: Observable<ICategoryResponse>;
  userId: number | null = null;

  ngOnInit(): void {
    this.userId = this.userService.userId();
    this.categories$ = this.categoriesService.getCategories();

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
      categoria: [null, Validators.required],
      activo: [true, Validators.required],
    });
  }

  createProductAdvertise(): void {
    if (this.form.invalid) {
      this.snackBar.open(
        'Por favor, completa todos los campos obligatorios.',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    const productData: ICreateProduct = {
      ...this.form.value,
      arrendador: this.userId,
    };

    this.productService.createProduct(productData).subscribe({
      next: (result) => {
        this.snackBar.open('Producto creado con éxito.', 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-green-600', 'text-white'],
        });
        this.router.navigate(['/my-product']);
      },
      error: () => {
        this.snackBar.open('Error al crear el producto.', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
