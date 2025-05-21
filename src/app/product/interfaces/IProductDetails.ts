export interface IApiResponse {
    "success": boolean,
    "pages": number,
    "count": number,
}

export interface IApiResponseError {
    "success": boolean,
    "error": number,
    "code": number,
}

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


export interface IProductDetail extends IApiResponse {
    result: IProductDetailResult
}
