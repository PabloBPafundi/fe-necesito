export interface ILoginResponse {
    success: boolean;
    message: string;
    result: IUserData[];
  }

interface IUserData {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    georreferencias: any[];
}