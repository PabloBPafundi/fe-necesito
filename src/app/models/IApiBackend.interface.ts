export interface IApiResponseSucces<T> {
  success: true;
  pages: number;
  count: number;
  result: T;
}

export interface IApiResponseError {
  success: false;
  error: number;
  code: number;
}