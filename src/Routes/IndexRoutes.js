import express from 'express';
import { index, categories } from '../Controllers/HomeController.js';

const router = express.Router();

router.get('/', index);
router.get('/category/:slug', categories);

export default router;
