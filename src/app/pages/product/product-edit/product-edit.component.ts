import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { UserService } from '../../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ICategoryResponse } from '../../../shared/types/ICategory.interface';
import { IArticuloResponse } from '../../../shared/types/IProductDetails';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    AsyncPipe,
    NgFor,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent
  ],
  templateUrl: './product-edit.component.html',
})
export class ProductEditComponent implements OnInit {
  form!: FormGroup;
  categories$!: Observable<ICategoryResponse>;
  productId!: number;
  productDetail!: IArticuloResponse;

  existingImages: { url: string; posicion: number }[] = [];
  newImages: { base64: string; posicion: number }[] = [];
  deletedImages: { posicion: number }[] = [];

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.categories$ = this.categoryService.getCategories();

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoria: [null, Validators.required],
      activo: [true, Validators.required]
    });

    this.loadProductDetail();
  }

  loadProductDetail(): void {
    this.productService.getIProductDetailResultById(this.productId).subscribe({
      next: (product) => {
        this.productDetail = product;
        this.form.patchValue({
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          categoria:
            typeof product.categoria === 'object' && product.categoria !== null
              ? product.categoria
              : typeof product.categoria === 'number'
              ? product.categoria
              : null,
          activo: product.activo,
        });

        this.existingImages = (product.imagenes ?? [])
          .filter(img => img.data.startsWith('http'))
          .map((img, index) => ({ url: img.data, posicion: index + 1 }));
      },
      error: () => {
        this.snackBar.open('Error al cargar el producto.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    if ((this.existingImages.length + this.newImages.length + files.length) > 10) {
      this.snackBar.open('Máximo 10 imágenes permitidas.', 'Cerrar', { duration: 3000 });
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newImages.push({ base64: e.target.result, posicion: 0 });
      };
      reader.readAsDataURL(file);
    });
  }

  removeExistingImage(index: number): void {
      const removed = this.existingImages.splice(index, 1)[0];
    if (removed) {
      this.deletedImages.push({ posicion: removed.posicion });
    }
  }

  removeNewImage(index: number): void {
    this.newImages.splice(index, 1);
  }

  updateProduct(): void {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, completa todos los campos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const deleteImagesPayload = this.deletedImages.map(img => ({
      data: 'delete',
      posicion: img.posicion
    }));

    const deletedPositions = this.deletedImages.map(img => img.posicion);
    const existingPositions = this.existingImages.map(img => img.posicion);

    let maxPosition = existingPositions.length > 0 ? Math.max(...existingPositions) : 0;

    const newImagesPayload: { data: string; posicion: number }[] = [];

    let freePositions = [...deletedPositions].sort((a,b) => a - b);

    this.newImages.forEach((img) => {
      if (freePositions.length > 0) {
        const pos = freePositions.shift()!;
        newImagesPayload.push({ data: img.base64, posicion: pos });
      } else {
        newImagesPayload.push({ data: img.base64, posicion: ++maxPosition });
      }
    });

    const imagenesPayload = [...deleteImagesPayload, ...newImagesPayload];

    const productData = {
      ...this.form.value,
      imagenes: imagenesPayload
    };

    this.productService.updateIProductDetailResult(this.productId, productData).subscribe({
      next: () => {
        this.snackBar.open('Producto actualizado con éxito.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/my-product']);
      },
      error: () => {
        this.snackBar.open('Error al actualizar el producto.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
