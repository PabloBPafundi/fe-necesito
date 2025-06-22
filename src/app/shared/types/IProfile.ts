import { IGeorreferenciaResponse } from './IGeorreferencia.interface';


export interface IUserProfile {
  nombre: string;
  apellido: string;
  georreferencias: IGeorreferenciaResponse[];
  email: string;
}


export interface IUserProfileResult {
  id:number
  nombre: string;
  apellido: string;
  georreferencias: IGeorreferenciaResponse[];
  email: string;
}


export interface IUserPassword {
  password: string;
}


