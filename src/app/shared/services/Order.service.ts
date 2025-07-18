import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { HandleErrorService } from './HandleError.service';
import { UserService } from './user.service';
import { IReserva, IReservaResponse } from '../types/IOrder.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrlOrdenes = `${environment.apiBaseUrl}/ordenes`;

  constructor(
    private http: HttpClient,
    private handleError: HandleErrorService,
    private userService: UserService
  ) {}

  crearOrden(body: any): Observable<IReservaResponse> {
    return this.http.post<IReservaResponse>(this.apiUrlOrdenes, body);
  }
  
  /**
   * Obtiene las órdenes asociadas al arrendador actual.
   * @returns Observable<IOrder[]>
   */
  getOrderFromUser(): Observable<IReserva[]> {
    const userId = this.userService.userId(); 

    const url = `${this.apiUrlOrdenes}?arrendador_arrendatario=${userId}&maxResults=100&sort=[id:DESC]`;

    return this.http.get<IReservaResponse>(url).pipe(
      map((response) => {
        if (response.success) {
          return response.result;
        } else {
          throw new Error('La respuesta de órdenes no fue exitosa.');
        }
      }),
      catchError((err) => this.handleError.handleError(err))
    );
  }

  getOrderFromUserWithData(params: any): Observable<IReservaResponse> {
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.apiUrlOrdenes}?${queryString}`;

    return this.http.get<IReservaResponse>(url).pipe(
      map((response) => {
        if (response.success) {
          return response;
        } else {
          throw new Error('La respuesta de órdenes no fue exitosa.');
        }
      }),
      catchError((err) => this.handleError.handleError(err))
    );
  }

  updateOrder(id: number, payload: any): Observable<any> {
    return this.http.patch(`${this.apiUrlOrdenes}/${id}`, payload);
  }
}
