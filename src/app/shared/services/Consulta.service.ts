import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IConsultaResponse } from '../types/IConsulta.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  private apiUrl = 'http://127.0.0.1:8000/api/consultas';

  constructor(private http: HttpClient) {}

  getConsultasPorArticulo(articuloId: number): Observable<IConsultaResponse> {
    return this.http.get<IConsultaResponse>(`${this.apiUrl}?articulo=${articuloId}`);
  }

  crearConsulta(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
