const isProduction = process.env.NODE_ENV === 'production';

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true
}

export {
    isProduction,
    refreshTokenCookieOptions,
    corsOptions
}