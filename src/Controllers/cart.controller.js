import { fetchProducts } from '../utils/fetch-products.js';
import { fetchUserById } from '../utils/fetch-user-by-id.js';
import validator from 'validator';
import User from '../models/User.js';

export const getUserCart = async (req, res) => {
	try {
		const userId = req.session?.user;

		if (!userId) {
			throw new Error('User Not authenticated.');
		}

		const user = await fetchUserById(userId);

		if (!user) {
			throw new Error('User not found.');
		}

		const products = await fetchProducts();
		const cartProducts = products
			.filter((p) => user.cart.some((item) => item.slug === p.slug))
			.map((product) => {
				const cartItem = user.cart.find((item) => item.slug === product.slug);
				return { ...product, quantity: cartItem.quantity };
			});

		if (req.headers['test']) {
			return res.status(200).json({ success: true, message: 'Products found', cartProducts });
		}

		return res.render('partials/cart-items', { layout: false, cartProducts });
	} catch (error) {
		if (!req.headers['test']) {
			console.error(error);
			req.flash('errorMsg', error.message || 'Error when searching for cart.');
			return res.redirect(req.headers.referer || '/');
		} else {
			return res.status(400).json({ error: error.message || 'Error when searching for cart.' });
		}
	}
};

export const addToCart = async (req, res) => {
	try {
		const userId = req.session?.user;
		const redirectTo = req.body.redirectTo || req.headers.referer || '/';
        const { slug, quantity } = req.body;

		if (!userId) { throw new Error('User Not authenticated.'); }

		const user = await fetchUserById(userId);

		if (!user) { throw new Error('User not found.'); }

		if (!slug || !validator.isSlug(slug)) { throw new Error('Invalid slug.'); }

		const parsedQuantity = parseInt(quantity, 10);

		if (isNaN(parsedQuantity) || parsedQuantity < 1) { throw new Error('Invalid quantity.'); }

        const sanitizedSlug = slug.trim();

		const products = await fetchProducts();
		const product = products.find((p) => p.slug === sanitizedSlug);

		if (!product) { throw new Error('Product not found.'); }

		const cart = user.cart || [];
		const existingItem = cart.find((item) => item.slug === slug);

		if (existingItem) {
			existingItem.quantity += parsedQuantity;
		} else {
			cart.push({ slug, quantity: parsedQuantity });
		}

		await User.update({ cart }, { where: { id: userId } });

        if (req.headers['test']) {
            return res.status(200).json({ success: true, message: 'Product added to cart.', user: user.cart });
        }

		req.flash('successMsg', 'Product added to cart.');
		return res.redirect(redirectTo);
	} catch (error) {
        if (!req.headers['test']) {
            const redirectTo = req.body.redirectTo || req.headers.referer || '/';
			console.error(error);
			req.flash('errorMsg', error.message || 'Error when adding to cart.');
			return res.redirect(redirectTo);
		} else {
			return res.status(400).json({ error: error.message || 'Error when adding to cart.' });
		}
	}
};

export const removeFromCart = async (req, res) => {
	try {
		const userId = req.session?.user;
		const { slug } = req.params;
        const sanitizedSlug = slug.trim();

        const user = await fetchUserById(userId);
        const isInCart = user.cart?.some((item) => item.slug === sanitizedSlug)
        const isAjax = req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest';

		if (!userId) { throw new Error('User Not authenticated.'); }

		if (!slug || !validator.isSlug(slug)) { throw new Error('Invalid slug.'); }

		if (!user) { throw new Error('User not found.'); }

		if (!isInCart) { throw new Error('Item not found in cart.'); }

		user.cart = (user.cart || []).filter((item) => item.slug !== sanitizedSlug);

		await User.update({ cart: user.cart }, { where: { id: userId } });

		if (isAjax) return res.status(200).json({ success: true });

        if (req.headers['test']) {
            return res.status(200).json({ success: true, message: 'Item removed from cart.', user: user.cart });
        }

		req.flash('successMsg', 'Item removed from cart.');
		return res.redirect(req.headers.referer || '/');
	} catch (error) {
        if (!req.headers['test']) {
			console.error(error);
			req.flash('errorMsg', error.message || 'Error to remove item.');
			return res.redirect(req.headers.referer || '/');
		} else {
            const isAjax = req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest';
            if(isAjax) {
                return res.status(400).json({ error: error.message || 'Error to remove item.' });
            }
			return res.status(400).json({ error: error.message || 'Error to remove item.' });
		}
	}
};

export const updateCartQuantity = async (req, res) => {
	try {
		const userId = req.session?.user;
		const { slug, quantity } = req.body;
        
        const user = await fetchUserById(userId);
        const parsedQuantity = parseInt(quantity, 10);

		if (isNaN(parsedQuantity) || parsedQuantity < 1) { throw new Error('Invalid quantity.'); }

        if(!userId) { throw new Error('User Not authenticated.'); }

        if (!slug || !validator.isSlug(slug)) { throw new Error('Invalid slug.'); }

		if (!user) return res.status(404).json({ error: 'User not found.' });

		const cart = user.cart.map((item) =>
			item.slug === slug ? { ...item, quantity: parseInt(quantity) } : item
		);

		await User.update({ cart }, { where: { id: userId } });

        if (req.headers['test']) {
            return res.status(200).json({ success: true, message: 'quantity updated.', user: user.cart });
        }

		return res.status(200).json({ success: true });
	} catch (error) {
        if (req.headers['test']) {
            return res.status(400).json({ error: error.message || 'Failed to update quantity.' });
		} else {
            console.error(error);
		    return res.status(500).json({ error: 'Failed to update quantity.' });
        }
    }
};

export const checkout = async (req, res) => {
    if (req.headers['test']) {
        return res.status(200).json({ success: true, message: 'order completed! ;-)' });
    }
	req.flash('successMsg', 'order completed! ;-)');
	return res.redirect('/');
};
