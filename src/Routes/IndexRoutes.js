import express from 'express';
import { index, categories, search } from '../Controllers/home.controller.js';

const router = express.Router();

router.get('/', index);
router.get('/category/:slug', categories);
router.get('/search', search);

export default router;
