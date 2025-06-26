import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILocalidad } from '../types/ILocalidad.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  private apiUrl = `${environment.apiBaseUrl}/localidades`;

  constructor(private http: HttpClient) {}

  getLocalidades(): Observable<ILocalidad[]> {
      return this.http.get<{ result: ILocalidad[] }>(this.apiUrl)
        .pipe(
            map(response => response.result)
        );
  }
}
