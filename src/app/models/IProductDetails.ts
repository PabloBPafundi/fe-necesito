export interface IProductDetailResult {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
  categoria?: number | null;
  arrendador?: number | null;
  imagenes?: any[];
}

export interface ICreateProduct {
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
  categoria?: number | null;
  arrendador?: number | null;
  imagenes?: any[];
}

export interface IProductQueryParamsSearch {
  page?: number;
  maxResults?: number;
  sort?: string;
  nombre?: string;
  descripcion?: string;
  activo?: 0 | 1;
  categoria?: number;
  arrendador?: number;
  precioMin?: number;
  precioMax?: number;
}
