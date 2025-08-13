import { ApiResponse } from '../utils/ApiResponse.js';

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal Server Error";
    res.status(statusCode).json(new ApiResponse(statusCode, errorMessage, null));
}