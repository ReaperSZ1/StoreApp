import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // max limit of 100 requests per IP
    message: 'Too many requests, please try again later.'
});

