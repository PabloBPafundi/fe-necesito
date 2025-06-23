import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategoryResponse } from '../types/ICategory.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private domainApi = `${environment.apiBaseUrl}/categorias`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ICategoryResponse> {
    return this.http.get<ICategoryResponse>(this.domainApi);
  }
}