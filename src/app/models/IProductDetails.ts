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

