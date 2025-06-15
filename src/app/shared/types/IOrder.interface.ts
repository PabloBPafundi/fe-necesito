import { IApiResponseSucces } from "./IApiBackend.interface";
import { ICalificacion } from "./ICalificacion.interface";
import { IArticuloResponse } from "./IProductDetails";
import { IUsuario } from "./IUser.interface";

// Respuesta final
export type IReservaResponse = IApiResponseSucces<IOrder[]>;

// Interfaces auxiliares

export interface IOrder {
  id: number;
  fecha_desde: string; 
  fecha_hasta: string;
  precio: number;
  acepto_arrendador: boolean;
  acepto_arrendatario: boolean;
  observaciones: string;
  calificacion: ICalificacion;
  estado: IEstado;
  articulo: IArticuloResponse;
  arrendador: IUsuario;
  arrendatario: IUsuario;
  seguro_contratado: null | any;
}


export interface IEstado {
  id: number;
  nombre: string;
  codigo: string;
}

