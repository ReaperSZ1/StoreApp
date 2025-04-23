import express from 'express';
import { index, categories, search } from '../Controllers/home.controller.js';
import { limiter } from '../Middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.get('/', index, limiter);
router.get('/category/:slug', categories, limiter);
router.get('/search', search, limiter);

export default router;
