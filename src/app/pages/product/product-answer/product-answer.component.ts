// product-answer.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultaService } from '../../../shared/services/Consulta.service';
import { IConsulta, IConsultaResponse } from '../../../shared/types/IConsulta.interface';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-answer',
  templateUrl: './product-answer.component.html',
  standalone: true,
  imports: [MatPaginatorModule, FormsModule, MatTableModule, NgIf, MatIconModule, MatTooltipModule],
  styleUrls: ['./product-answer.component.css'],
})
export class ProductAnswerComponent implements OnInit {
  consultas: IConsulta[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  respuestaMap: { [consultaId: number]: string } = {};

  productoId!: number;
  isLoading = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private consultaService: ConsultaService,
  ) {}

  ngOnInit() {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadConsultas();
  }

  loadConsultas() {
    this.isLoading = true;
    this.consultaService.getConsultasSinResponder({
      articulo: this.productoId,
      page: this.currentPage,
      maxResults: this.itemsPerPage,
    }).subscribe({
      next: (res: IConsultaResponse) => {
        this.consultas = res.result;
        this.totalPages = res.pages;
        this.isLoading = false;
      },
      error: () => {
        this.consultas = [];
        this.isLoading = false;
        this.errorMsg = 'Error al cargar consultas';
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.loadConsultas();
  }

  responder(consulta: IConsulta) {
    const respuesta = this.respuestaMap[consulta.id];
    if (!respuesta || !respuesta.trim()) {
      alert('Escribí una respuesta antes de enviar.');
      return;
    }

    this.consultaService.responderConsulta(consulta.id!, respuesta).subscribe({
      next: () => {
        alert('Respuesta enviada');
        this.respuestaMap[consulta.id!] = '';
        this.loadConsultas();
      },
      error: (err) => alert(err.error),
    });
  }
}
