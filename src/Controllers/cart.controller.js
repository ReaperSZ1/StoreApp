import { fetchProducts } from '../utils/fetch-products.js';
import { fetchUserById } from '../utils/fetch-user-by-id.js';
import validator from 'validator';
import User from '../models/User.js';

export const getUserCart = async (req, res) => {
    try {
        const userId = req.session?.user;
        if (!userId) {
            req.flash('errorMsg', 'Not authenticated.');
            return res.redirect(req.headers.referer || '/');
        }

        const user = await fetchUserById(userId);
        if (!user) {
            req.flash('errorMsg', 'User not found.');
            return res.redirect(req.headers.referer || '/');
        }

        const products = await fetchProducts();
        const cartProducts = products
            .filter(p => user.cart.some(item => item.slug === p.slug))
            .map(product => {
                const cartItem = user.cart.find(item => item.slug === product.slug);
                return { ...product, quantity: cartItem.quantity };
            });

        return res.render('partials/cart-items', { layout: false, cartProducts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error when searching for cart.' });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.session?.user;
        const redirectTo = req.body.redirectTo || req.headers.referer || '/';
        if (!userId) {
            req.flash('errorMsg', 'Not authenticated.');
            return res.redirect(redirectTo);
        }

        const user = await fetchUserById(userId);
        if (!user) {
            req.flash('errorMsg', 'User not found.');
            return res.redirect(redirectTo);
        }

        const { slug, quantity } = req.body;
        if (!slug || !validator.isSlug(slug)) {
            req.flash('errorMsg', 'Invalid slug.');
            return res.redirect(redirectTo);
        }

        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            req.flash('errorMsg', 'Invalid quantity.');
            return res.redirect(redirectTo);
        }

        const products = await fetchProducts();
        const product = products.find(p => p.slug === slug);

        if (!product) {
            req.flash('errorMsg', 'Product not found.');
            return res.redirect(redirectTo);
        }

        const cart = user.cart || [];
        const existingItem = cart.find(item => item.slug === slug);

        if (existingItem) {
            existingItem.quantity += parsedQuantity;
        } else {
            cart.push({ slug, quantity: parsedQuantity });
        }

        await User.update( { cart }, { where: { id: userId } });

        req.flash('successMsg', 'Product added to cart.');
        return res.redirect(redirectTo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error when adding to cart.' });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.session?.user;
        const { slug } = req.params;
        const isAjax = req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest';

        if (!userId) {
            if (isAjax) return res.status(401).json({ error: 'Not authenticated.' });
            req.flash('errorMsg', 'Not authenticated.');
            return res.redirect(req.headers.referer || '/');
        }

        if (!slug || !validator.isSlug(slug)) {
            if (isAjax) return res.status(400).json({ error: 'Invalid slug.' });
            req.flash('errorMsg', 'Invalid slug.');
            return res.redirect(req.headers.referer || '/');
        }

        const user = await fetchUserById(userId);
        if (!user) {
            if (isAjax) return res.status(404).json({ error: 'User not found.' });
            req.flash('errorMsg', 'User not found.');
            return res.redirect(req.headers.referer || '/');
        }

        user.cart = (user.cart || []).filter(item => item.slug !== slug);
        await User.update( { cart: user.cart }, { where: { id: userId } });

        if (isAjax) return res.status(200).json({ success: true });
        
        req.flash('successMsg', 'Item removed from cart.');
        return res.redirect(req.headers.referer || '/');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error to remove item.' });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.session?.user;
        const { slug } = req.params;
        const { quantity } = req.body;

        if (!userId || !slug || !validator.isSlug(slug) || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ error: 'Invalid input.' });
        }

        const user = await fetchUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const cart = user.cart.map(item =>
            item.slug === slug ? { ...item, quantity: parseInt(quantity) } : item
        );

        await User.update({ cart }, { where: { id: userId } });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update quantity.' });
    }
};

