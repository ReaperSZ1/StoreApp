import express from 'express';
import { getFavorites, postFavorites, userFavorites } from '../Controllers/favorite.controller.js';

const router = express.Router();

router.get('/favorites', getFavorites);
router.post('/api/favorites', postFavorites);
router.get('/my-favorites', userFavorites);

export default router;
