import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse, Localidad, Provincia } from '../types/IFilterProduct.interface';
import { HandleErrorService } from './HandleError.service';
@Injectable({
  providedIn: 'root',
})
export class FilterProductService {

  private apiUrlOrdenes = 'http://127.0.0.1:8000//api/ordenes';

  constructor(private http: HttpClient, private handleError: HandleErrorService) {}

  /**
   * Obtiene la lista de localidades.
   * @returns Observable<Localidad[]>
   */
  getLocalidades(): Observable<Localidad[]> {
    return this.http.get<ApiResponse<Localidad[]>>(this.apiUrlOrdenes)
      .pipe(
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

}
