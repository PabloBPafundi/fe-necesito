export interface ApiResponse<T> {
  success: boolean;
  pages: number;
  count: number;
  result: T;
}

export interface Localidad {
  id: number;
  nombre: string;
  codigo_postal: string;
}

export interface Provincia {
  id: number;
  nombre: string;
}