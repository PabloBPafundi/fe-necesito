import { IImagenesRequest, IImagenesResponse } from "./IImagenes.interface";

export interface IArticuloResponse {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
  categoria?: number | null;
  arrendador?: number | null;
  imagenes?: IImagenesResponse[];
}

export interface ICreateProduct {
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
  categoria?: number | null;
  arrendador?: number | null;
  imagenes?: IImagenesRequest[];
}

export interface IProductQueryParamsSearch {
  page?: number;
  maxResults?: number;
  sort?: string;
  nombre?: string;
  descripcion?: string;
  activo?: 0 | 1;
  categoria?: number[];
  arrendador?: number;
  precioMin?: number;
  precioMax?: number;
  no_arrendador?: number;
}
