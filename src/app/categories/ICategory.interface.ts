export interface Category {
  id: number;
  nombre: string;
  codigo: string;
  categoria_padre: number | null;
}

export interface ICategoryResponse {
  success: boolean;
  pages: number;
  count: number;
  result: Category[];
}