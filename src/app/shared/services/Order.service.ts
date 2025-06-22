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
  private apiUrlOrdenes = 'http://127.0.0.1:8000/api/ordenes';

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

    const url = `${this.apiUrlOrdenes}?arrendador=${userId}`;

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
}
