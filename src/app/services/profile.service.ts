import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IUserPassword,
  IUserProfile,
  IUserProfileResult,
} from '../models/IProfile';
import {
  IApiResponseError,
  IApiResponseSucces,
} from '../models/IApiBackend.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://127.0.0.1:8000/api/usuarios';

  constructor(private http: HttpClient) {}

  getUserProfile(userId: number | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  updateUserProfile(userId: number, userData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}`, userData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  changePassword(
    userId: number,
    userData: IUserPassword
  ): Observable<IApiResponseSucces<IUserProfileResult> | IApiResponseError> {
    return this.http.patch<
      IApiResponseSucces<IUserProfileResult> | IApiResponseError
    >(`${this.apiUrl}/${userId}`, userData);
  }
}
