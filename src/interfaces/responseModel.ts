export interface ResponseModel<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    error?: string;
}