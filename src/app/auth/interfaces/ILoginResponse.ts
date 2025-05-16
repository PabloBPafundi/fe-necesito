export interface ILoginResponse {
    success: boolean;
    message: string;
    token: string;
    result: IUserData[];
  }

export interface IUserData {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    georreferencias: any[];
}

export interface ILoginError{
    code: number;
    message: string;

}
