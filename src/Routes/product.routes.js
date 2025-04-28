import express from 'express';
import { product } from '../Controllers/product.controller.js';

const router = express.Router();

router.get('/product/:slug', product);

export default router;
