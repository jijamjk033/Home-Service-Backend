import { ResponseModel } from "../interfaces/responseModel";

export const createSuccessResponse = <T>(data: T, message?: string): ResponseModel<T> => ({
    status: 'success',
    data,
    message,
});

export const createErrorResponse = (error: string, message?: string): ResponseModel<null> => ({
    status: 'error',
    error,
    message,
});