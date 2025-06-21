import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IArticuloResponse } from '../../../shared/types/IProductDetails';
import { IImagenesResponse } from '../../../shared/types/IImagenes.interface';
import { ICalificacion } from '../../../shared/types/ICalificacion.interface';
import { IConsulta, IConsultaResponse } from '../../../shared/types/IConsulta.interface';
import { ProductService } from '../../../shared/services/product.service';
import { OrderService } from '../../../shared/services/Order.service';
import { UserService } from '../../../shared/services/user.service';
import { ConsultaService } from '../../../shared/services/Consulta.service';

@Component({
  selector: 'app-product-detail',
  imports: [NgIf, NgFor, NgClass, FormsModule],
  standalone: true,
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  productDetail: IArticuloResponse | null = null;
  errorMessage: string | null = null;
  listaDeCalificacionesDelProducto: ICalificacion[] = [];

  // Para contratar
  fechaDesde: string = '';
  fechaHasta: string = '';
  observaciones: string = '';
  precioTotal: number = 0;
  isLoadingOrden: boolean = false;
  ordenMensaje: string = '';
  imagenActual: number = 0;

  // Consultas
  consultas: IConsulta[] = [];
  nuevaConsulta: string = '';
  isLoadingConsultas: boolean = false;
  consultaMensaje: string = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    private consultaService: ConsultaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProducto(id);
    this.cargarConsultas(id);
  }

  cargarProducto(id: number) {
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
  }

  cargarConsultas(articuloId: number) {
    this.isLoadingConsultas = true;
    this.consultaService.getConsultasPorArticulo(articuloId).subscribe({
      next: (res: IConsultaResponse) => {
        this.consultas = res.result; 
        this.isLoadingConsultas = false;
      },
      error: () => {
        this.consultas = [];
        this.isLoadingConsultas = false;
      },
    });
  }

  getProductImage(imagen: IImagenesResponse): string {
    if (!imagen || !imagen.data) {
      return 'https://placehold.co/400x300/E0E0E0/666666?text=No+Image';
    }
    // Si la data es URL (http, https)
    if (imagen.data.startsWith('http://') || imagen.data.startsWith('https://')) {
      return imagen.data;
    }
    // Si es base64, agregamos el prefijo
    return `data:image/jpeg;base64,${imagen.data}`;
  }

  get imagenActualObjeto(): IImagenesResponse | null {
    if (!this.productDetail?.imagenes?.length) {
      return null;
    }
    return this.productDetail.imagenes[this.imagenActual];
  }


  calcularPrecioTotal() {
    if (!this.productDetail) {
      this.precioTotal = 0;
      return;
    }
    if (!this.fechaDesde || !this.fechaHasta) {
      this.precioTotal = 0;
      return;
    }

    const desde = new Date(this.fechaDesde);
    const hasta = new Date(this.fechaHasta);

    const diffMs = hasta.getTime() - desde.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) || 0;

    this.precioTotal = diffDias > 0 ? diffDias * this.productDetail.precio : this.productDetail.precio;
  }

  contratar() {
    if (!this.productDetail) return;
    if (!this.fechaDesde || !this.fechaHasta) {
      this.ordenMensaje = 'Por favor selecciona ambas fechas.';
      return;
    }

    const desde = new Date(this.fechaDesde);
    const hasta = new Date(this.fechaHasta);
    if (desde > hasta) {
      this.ordenMensaje = 'La fecha "Desde" no puede ser posterior a la fecha "Hasta".';
      return;
    }

    this.isLoadingOrden = true;
    this.ordenMensaje = '';

    const body = {
      articulo: this.productDetail.id!,
      arrendador: this.productDetail.arrendador!,  // Asumí que está
      arrendatario: Number(localStorage.getItem('userId')), // O cómo obtienes user id
      fecha_desde: `${this.fechaDesde} 00:00:00`,
      fecha_hasta: `${this.fechaHasta} 00:00:00`,
      precio_total: this.precioTotal.toFixed(2),
      observaciones: this.observaciones || '',
    };

    this.orderService.crearOrden(body).subscribe({
      next: () => {
        this.isLoadingOrden = false;
        this.ordenMensaje = 'La orden fue generada correctamente.';
        // Limpiar form
        this.fechaDesde = '';
        this.fechaHasta = '';
        this.observaciones = '';
        this.precioTotal = 0;
      },
      error: (err) => {
        this.isLoadingOrden = false;
        this.ordenMensaje = 'Error al generar la orden: ' + err.message;
      },
    });
  }

  anteriorImagen() {
    if (!this.productDetail?.imagenes?.length) return;
    this.imagenActual = (this.imagenActual - 1 + this.productDetail.imagenes.length) % this.productDetail.imagenes.length;
  }

  siguienteImagen() {
    if (!this.productDetail?.imagenes?.length) return;
    this.imagenActual = (this.imagenActual + 1) % this.productDetail.imagenes.length;
  }


  seleccionarImagen(index: number) {
    this.imagenActual = index;
  }

  agregarConsulta() {
    const userId = this.userService.userId();
    if (!this.nuevaConsulta.trim() || !this.productDetail) {
      this.consultaMensaje = 'Escribe una pregunta antes de enviar.';
      return;
    }

    this.isLoadingConsultas = true;
    this.consultaMensaje = '';

    const body = {
      articulo: this.productDetail.id!,
      pregunta: this.nuevaConsulta.trim(),
      respuesta: null,
      arrendador: this.productDetail.arrendador!,
      arrendatario: userId,
    };

    this.consultaService.crearConsulta(body).subscribe({
      next: () => {
        this.nuevaConsulta = '';
        this.consultaMensaje = 'Consulta enviada correctamente.';
        this.isLoadingConsultas = false;
        if (this.productDetail) {
          this.cargarConsultas(this.productDetail.id!);
        }
      },
      error: (err) => {
        this.consultaMensaje = 'Error al enviar consulta: ' + err.error.error;
        this.isLoadingConsultas = false;
      },
    });
  }
}
