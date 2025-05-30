import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IProductDetailResult } from '../../../models/IProductDetails'

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/articulos';

  constructor(private http: HttpClient) {}

  // Obtener lista paginada, con parámetros opcionales page, maxResults, sort
  getIProductDetailResults(params?: { page?: number; maxResults?: number; sort?: string }): Observable<IProductDetailResult[]> {
    return this.http
      .get<{ success: boolean; result: IProductDetailResult[] }>(this.apiUrl, { params: params as any })
      .pipe(
        map((res) => {
          if (res.success) {
            return res.result;
          }
          throw new Error('No se pudieron obtener los artículos');
        }),
        catchError(this.handleError)
      );
  }

  // Obtener un artículo por id
  getIProductDetailResultById(id: number): Observable<IProductDetailResult> {
    return this.http.get<{ success: boolean; result: IProductDetailResult }>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        if (res.success) {
          return res.result;
        }
        throw new Error('Artículo no encontrado');
      }),
      catchError(this.handleError)
    );
  }

  // Crear un nuevo artículo
  createIProductDetailResult(data: IProductDetailResult): Observable<IProductDetailResult> {
    return this.http.post<{ success: boolean; result: IProductDetailResult }>(this.apiUrl, data).pipe(
      map((res) => {
        if (res.success) {
          return res.result;
        }
        throw new Error('Error al crear artículo');
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar artículo (PUT o PATCH)
  updateIProductDetailResult(id: number, data: Partial<IProductDetailResult>): Observable<IProductDetailResult> {
    return this.http.put<{ success: boolean; result: IProductDetailResult }>(`${this.apiUrl}/${id}`, data).pipe(
      map((res) => {
        if (res.success) {
          return res.result;
        }
        throw new Error('Error al actualizar artículo');
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar artículo
  deleteIProductDetailResult(id: number): Observable<string> {
    return this.http.delete<{ success: boolean; result: string }>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        if (res.success) {
          return res.result;
        }
        throw new Error('Error al eliminar artículo');
      }),
      catchError(this.handleError)
    );
  }

  // Manejo de errores común
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido.';
    if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
