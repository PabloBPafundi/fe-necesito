import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { ICalificacion } from '../../../../shared/types/ICalificacion.interface';

@Component({
  selector: 'app-product-review',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './product-review.component.html',
})
export class ProductReviewComponent {
  @Input() calificaciones: ICalificacion[] = [];

  getNumericRating(rating: string | null | undefined): number {
    return rating ? parseInt(rating, 10) : 0;
  }

  getStarsArray(max: number = 5): number[] {
    return Array(max)
      .fill(0)
      .map((_, i) => i + 1);
  }
  shouldShowDivider(
    calificacion: ICalificacion,
    currentSection: 'arrendatario' | 'arrendador'
  ): boolean {
    if (currentSection === 'arrendatario') {
      const arrendatarioHasContent =
        calificacion.calificacion_arrendatario ||
        calificacion.descripcion_arrendatario;
      const nextSectionsHaveContent =
        calificacion.calificacion_arrendador ||
        calificacion.descripcion_arrendador ||
        calificacion.calificacion_articulo ||
        calificacion.descripcion_articulo;
      return !!(arrendatarioHasContent && nextSectionsHaveContent);
    }
    if (currentSection === 'arrendador') {
      const arrendadorHasContent =
        calificacion.calificacion_arrendador ||
        calificacion.descripcion_arrendador;
      const nextSectionHasContent =
        calificacion.calificacion_articulo || calificacion.descripcion_articulo;
      return !!(arrendadorHasContent && nextSectionHasContent);
    }
    return false;
  }
}
