import express from 'express';
import { getFavorites, postFavorites, userFavorites } from '../Controllers/favorite.controller.js';
import { checkAuth } from '../Middlewares/check-auth.middleware.js';

const router = express.Router();

router.get('/favorites', checkAuth, getFavorites);
router.post('/api/favorites', checkAuth, postFavorites);
router.get('/my-favorites', checkAuth, userFavorites);

export default router;
