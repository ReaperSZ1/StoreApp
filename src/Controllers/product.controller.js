import { fetchProducts } from '../utils/fetch-products.js';
import { fetchCategories } from '../utils/fetch-categories.js';
import { fetchUserById } from '../utils/fetch-user-by-id.js';

import validator from 'validator';

export const product = async (req, res) => {
    const { slug } = req.params;

    const isSlugValid = slug && validator.isSlug(slug);
    
    if (!isSlugValid) {
        req.flash('errorMsg', 'Invalid category slug!');
        return res.redirect('/');
    }

    try {
        const isLoggedIn = req.session && req.session.isLoggedIn ? true : false;

        const categories = await fetchCategories();
        const products = await fetchProducts();

        let favorites = [];

        if (req.session?.user) {
            const user = await fetchUserById(req.session.user);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            favorites = user?.favorites;
        }

        const product = products
            .filter((p) => p.slug.toLowerCase() === slug.toLowerCase())
            .map((prod) => ({ ...prod, isFavorited: favorites.includes(prod.slug) }));

        
        if (!product) {
            return res.status(404).render('404', { message: 'product not found.' });
        }
            
        console.log(product);

        res.render('product/index', {
            product,
            isLoggedIn,
            categories,
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};