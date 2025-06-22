export interface IGeorreferenciaResponse {
  id: number;
  calle: string;
  altura: string;
  localidad: {
    id: number;
    nombre: string;
  };
  nombre: string;
}