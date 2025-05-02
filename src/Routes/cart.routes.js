import express from 'express';
import { getUserCart, addToCart, removeFromCart, updateCartQuantity } from '../Controllers/cart.controller.js';

const router = express.Router();

router.get('/getUserCart', getUserCart);
router.post('/addToCart', addToCart);
router.delete('/removeFromCart/:slug', removeFromCart);
router.put('/updateQuantity/:slug', updateCartQuantity);

export default router;