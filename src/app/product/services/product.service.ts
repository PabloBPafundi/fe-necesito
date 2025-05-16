import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import {
  IProductDetailResult,
  IProductDetail,
  IApiResponseError,
} from '../interfaces/IProductDetails';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private domainApi = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getProductById(id: number): Observable<IProductDetailResult> {
    return this.http
      .get<{ success: boolean; result: IProductDetailResult }>(
        `${this.domainApi}/articulos/${id}`
      )
      .pipe(
        map((response) => {
          if (response.success && response.result) {
            return response.result;
          } else {
            throw new Error('Producto no encontrado.');
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = 'Error desconocido.';
          if (error.error && error.error.error) {
            errorMsg = error.error.error;
          } else if (error.message) {
            errorMsg = error.message;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  getAllProducts(): Observable<IProductDetailResult[]> {
    return this.http
      .get<{ success: boolean; result: IProductDetailResult[] }>(
        `${this.domainApi}/articulos`
      )
      .pipe(
        map((response) => {
          if (response.success && response.result) {
            return response.result;
          } else {
            throw new Error('No se pudieron cargar los productos.');
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = 'Error al obtener los productos.';
          if (error.error?.error) {
            errorMsg = error.error.error;
          } else if (error.message) {
            errorMsg = error.message;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }
}
