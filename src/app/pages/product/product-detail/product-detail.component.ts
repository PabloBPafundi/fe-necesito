import { Component, OnInit } from '@angular/core';
import { IArticuloResponse } from '../../../shared/types/IProductDetails';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { ProductReviewComponent } from './product-review/product-review.component';
import { ICalificacion } from '../../../shared/types/ICalificacion.interface';
import { getBase64ImageUrl, isBase64Image } from '../../../shared/utils/getImageType';
import { cleanEscapedUrl } from '../../../shared/utils/cleanEscapedUrl';

@Component({
  selector: 'app-product-detail',
  imports: [NgIf, ProductReviewComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  productDetail: IArticuloResponse | null = null;
  errorMessage: string | null = null;
  listaDeCalificacionesDelProducto: ICalificacion[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getIProductDetailResultById(id).subscribe({
      next: (product) => {
        this.productDetail = product;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.productDetail = null;
      },
    });

    this.listaDeCalificacionesDelProducto = [
      {
        id: 1,
        calificacion_arrendatario: '5',
        descripcion_arrendatario:
          'El arrendatario fue muy cuidadoso y puntual.',
        calificacion_arrendador: '4',
        descripcion_arrendador: 'El arrendador explicó todo claramente.',
        calificacion_articulo: '5',
        descripcion_articulo:
          'El artículo estaba en perfectas condiciones, como nuevo.',
      },
      {
        id: 2,
        calificacion_arrendatario: null, // No siempre estarán todas las calificaciones
        descripcion_arrendatario: null,
        calificacion_arrendador: '5',
        descripcion_arrendador:
          'Proceso de entrega y devolución muy eficiente.',
        calificacion_articulo: '4',
        descripcion_articulo:
          'Buen estado general, algunos signos menores de uso.',
      },
      {
        id: 3,
        calificacion_articulo: '3',
        descripcion_articulo: 'Funcionó bien, pero la batería no duraba mucho.',
        // Las otras calificaciones y descripciones son null o undefined en este caso
      },
      // ... más calificaciones
    ];
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

  const isUrl = rawData.startsWith('http://') || rawData.startsWith('https://');

  return isUrl ? rawData : `data:image/jpeg;base64,${rawData}`;
}


}
