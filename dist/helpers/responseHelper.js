"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorResponse = exports.createSuccessResponse = void 0;
const createSuccessResponse = (data, message) => ({
    status: 'success',
    data,
    message,
});
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (error, message) => ({
    status: 'error',
    error,
    message,
});
exports.createErrorResponse = createErrorResponse;
