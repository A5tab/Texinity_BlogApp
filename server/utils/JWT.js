import jwt from 'jsonwebtoken';
import { ApiError } from './ApiError.js';

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}

export const verifyRefreshToken = (token) => {
    if (!token) throw new ApiError(401, "Token is missing");
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

export const verifyAccessToken = (token) => {
    if (!token) throw new ApiError(401, "Token is missing");
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

