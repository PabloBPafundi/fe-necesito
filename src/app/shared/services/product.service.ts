import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  ICreateProduct,
  IArticuloResponse,
  IProductQueryParamsSearch,
} from '../types/IProductDetails';
import {
  IApiResponseError,
  IApiResponseSucces,
} from '../types/IApiBackend.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/articulos';

  constructor(private http: HttpClient) {}

  getProductsFiltered(
    params: IProductQueryParamsSearch
  ): Observable<
    IApiResponseSucces<IArticuloResponse[]> | IApiResponseError
  > {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.maxResults !== undefined) {
      httpParams = httpParams.set('maxResults', params.maxResults.toString());
    }

    // Agregar parámetros opcionales solo si existen
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.nombre) httpParams = httpParams.set('nombre', params.nombre);
    if (params.descripcion)
      httpParams = httpParams.set('descripcion', params.descripcion);
    if (params.activo !== undefined)
      httpParams = httpParams.set('activo', params.activo.toString());
    if (params.categoria !== undefined)
      httpParams = httpParams.set('categoria_anidada', params.categoria.toString());
    if (params.arrendador !== undefined)
      httpParams = httpParams.set('arrendador', params.arrendador.toString());
    if (params.precioMin !== undefined)
      httpParams = httpParams.set('precio_minimo', params.precioMin.toString());
    if (params.precioMax !== undefined)
      httpParams = httpParams.set('precio_maximo', params.precioMax.toString());
     if (params.no_arrendador !== undefined)
      httpParams = httpParams.set('no_arrendador', params.no_arrendador.toString());

    return this.http
      .get<IApiResponseSucces<IArticuloResponse[]> | IApiResponseError>(
        this.apiUrl,
        { params: httpParams }
      )
      .pipe(
        map((res) => {
          if (res.success) {
            return res as IApiResponseSucces<IArticuloResponse[]>;
          }
          return res as IApiResponseError;
        }),
        catchError((err) => {
          console.error('HTTP Error', err);
          return throwError(() => err);
        })
      );
  }

  // Obtener un artículo por id
  getIProductDetailResultById(id: number): Observable<IArticuloResponse> {
    return this.http
      .get<{ success: boolean; result: IArticuloResponse }>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
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
  createProduct(data: ICreateProduct): Observable<IArticuloResponse> {
    return this.http
      .post<{ success: boolean; result: IArticuloResponse }>(
        this.apiUrl,
        data
      )
      .pipe(
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
  updateIProductDetailResult(
    id: number,
    data: Partial<IArticuloResponse>
  ): Observable<IArticuloResponse> {
    return this.http
      .put<{ success: boolean; result: IArticuloResponse }>(
        `${this.apiUrl}/${id}`,
        data
      )
      .pipe(
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
    return this.http
      .delete<{ success: boolean; result: string }>(`${this.apiUrl}/${id}`)
      .pipe(
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
