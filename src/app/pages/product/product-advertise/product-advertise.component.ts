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
// Importa los íconos de Lucide Angular que usarás
import { LucideAngularModule, UploadCloud, Image, ImagePlus, CheckCircle } from 'lucide-angular';
import { AsyncPipe, NgFor, NgIf } from '@angular/common'; // Agrega NgIf para la lógica de la imagen
import { Router } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';


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
    LucideAngularModule, // Asegúrate de que este módulo esté importado
    AsyncPipe,
    NgFor,
    NgIf, // Agrega NgIf aquí
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent
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
  readonly Image = Image; 
  readonly ImagePlus = ImagePlus; 
  readonly CheckCircle = CheckCircle;
  private router = inject(Router);

  form!: FormGroup;
  categories$!: Observable<ICategoryResponse>;
  userId: number | null = null;

  selectedFiles: File[] = [];
  previewImages: string[] = [];

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    const files = Array.from(input.files);

    if (this.selectedFiles.length + files.length > 10) {
      this.snackBar.open('Máximo 10 imágenes permitidas.', 'Cerrar', { duration: 3000 });
      return;
    }

    files.forEach(file => {
      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewImages.splice(index, 1);
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

    const imagenes = this.previewImages.map((base64, index) => ({
      data: base64,
      posicion: index + 1
    }));

    const productData: ICreateProduct = {
      ...this.form.value,
      arrendador: this.userId,
      imagenes: imagenes
    };

    this.productService.createProduct(productData).subscribe({
      next: () => {
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