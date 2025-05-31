export interface IApiResponseSucces<T> {
    success: boolean;
    pages: number;
    count: number;
    result: T;
}

export interface IApiResponseError {
    "success": boolean,
    "error": number,
    "code": number,
}