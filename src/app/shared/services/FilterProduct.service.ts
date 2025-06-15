import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse, Localidad, Provincia } from '../types/IFilterProduct.interface';
@Injectable({
  providedIn: 'root',
})
export class FilterProductService {
  private apiUrlLocalidades = 'http://127.0.0.1:8000/api/localidades';
  private apiUrlProvincias = 'http://127.0.0.1:8000/api/provincias';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de localidades.
   * @returns Observable<Localidad[]>
   */
  getLocalidades(): Observable<Localidad[]> {
    return this.http.get<ApiResponse<Localidad[]>>(this.apiUrlLocalidades)
      .pipe(
        map((response) => {
          if (response.success) {
            return response.result;
          } else {
            throw new Error('La respuesta de localidades no fue exitosa.');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene la lista de provincias.
   * @returns Observable<Provincia[]>
   */
  getProvincias(): Observable<Provincia[]> {
    return this.http.get<ApiResponse<Provincia[]>>(this.apiUrlProvincias)
      .pipe(
        map((response) => {
          if (response.success) {
            return response.result;
          } else {
            throw new Error('La respuesta de provincias no fue exitosa.');
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Maneja los errores de las peticiones HTTP.
   * @param error HttpErrorResponse
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}