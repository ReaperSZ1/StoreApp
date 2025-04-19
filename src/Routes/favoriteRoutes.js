import express from 'express';
import { getFavorites, postFavorites, userFavorites } from '../Controllers/FavoriteController.js';

const router = express.Router();

router.get('/favorites/:userId', getFavorites);
router.post('/api/favorites/:userId', postFavorites);
router.get('/my-favorites', userFavorites);

export default router;
