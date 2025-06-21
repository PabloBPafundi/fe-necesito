import { IApiResponseSucces } from './IApiBackend.interface';

export type IConsultaResponse = IApiResponseSucces<IConsulta[]>;

export interface IConsulta {
  id: number;
  pregunta: string;
  respuesta: string | null;
  arrendador: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    dni?: number;
  };
  arrendatario: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    dni?: number;
    georreferencias?: any[];
  };
  articulo: {
    id: number;
    nombre: string;
    descripcion?: string;
    precio?: number;
    activo?: boolean;
    categoria?: number;
    arrendador?: number;
  };
}
