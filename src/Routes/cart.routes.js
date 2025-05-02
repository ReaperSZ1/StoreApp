import express from 'express';
import { getUserCart, addToCart, removeFromCart, updateCartQuantity, checkout } from '../Controllers/cart.controller.js';

const router = express.Router();

router.get('/getUserCart', getUserCart);
router.post('/addToCart', addToCart);
router.delete('/removeFromCart/:slug', removeFromCart);
router.put('/updateQuantity/:slug', updateCartQuantity);
router.get('/checkout', checkout);

export default router;