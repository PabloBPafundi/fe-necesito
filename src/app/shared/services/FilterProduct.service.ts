import {
  HttpClient,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import {
  ApiResponse,
  Localidad,
  Provincia,
} from '../types/IFilterProduct.interface';
import { HandleErrorService } from './HandleError.service';
@Injectable({
  providedIn: 'root',
})
export class FilterProductService {
  private apiUrlLocalidades = 'http://127.0.0.1:8000/api/localidades';
  private apiUrlProvincias = 'http://127.0.0.1:8000/api/provincias';


  constructor(private http: HttpClient, private handleError: HandleErrorService) {}

  /**
   * Obtiene la lista de localidades.
   * @returns Observable<Localidad[]>
   */
  getLocalidades(): Observable<Localidad[]> {
    return this.http.get<ApiResponse<Localidad[]>>(this.apiUrlLocalidades).pipe(
      map((response) => {
        if (response.success) {
          return response.result;
        } else {
          throw new Error('La respuesta de localidades no fue exitosa.');
        }
      }),
       catchError((err) => this.handleError.handleError(err))
    );
  }

  /**
   * Obtiene la lista de provincias.
   * @returns Observable<Provincia[]>
   */
  getProvincias(): Observable<Provincia[]> {
    return this.http.get<ApiResponse<Provincia[]>>(this.apiUrlProvincias).pipe(
      map((response) => {
        if (response.success) {
          return response.result;
        } else {
          throw new Error('La respuesta de provincias no fue exitosa.');
        }
      }),
      catchError((err) => this.handleError.handleError(err))
    );
  }
}
