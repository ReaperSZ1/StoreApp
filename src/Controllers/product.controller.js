import { fetchProducts } from '../utils/fetch-products.js';
import { fetchCategories } from '../utils/fetch-categories.js';
import { fetchUserById } from '../utils/fetch-user-by-id.js';

import validator from 'validator';

export const product = async (req, res) => {
      try {
        const { slug } = req.params;

        const isSlugValid = slug && validator.isSlug(slug);
        
        if (!isSlugValid) { throw new Error('Invalid category slug!'); }

        const isLoggedIn = req.session && req.session.isLoggedIn ? true : false;

        const categories = await fetchCategories();
        const products = await fetchProducts();

        let favorites = [];	

        if (req.session.user) {
            const user = await fetchUserById(req.session.user);

            if (!user) { throw new Error('User not found'); }

            favorites = user?.favorites;
        }

        const sanitizedSlug = slug.trim();
        const product = products
            .filter((p) => p.slug.toLowerCase() === sanitizedSlug.toLowerCase())
            .map((prod) => ({ ...prod, isFavorited: favorites.includes(prod.sanitizedSlug) }));

        if (!product || product.length === 0) { throw new error('product not found.'); }

        if (req.headers['test']) {
            return res.status(200).json({ success: true, message: 'Product Found!', product });
        }
      
        res.render('product/index', {
            product,
            isLoggedIn,
            categories,
            requestUrl: req.originalUrl
        });
    } catch (error) {
        if (!req.headers['test']) {
			console.error(error);
			req.flash('errorMsg', error.message || 'Error while saving favorites');
			return res.redirect('/');
		} else {
			return res.status(400).json({ error: error.message || 'Error while saving favorites' });
		}
    }
};