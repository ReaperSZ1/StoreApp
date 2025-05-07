import { fetchProducts } from '../utils/fetch-products.js';
import { fetchCategories } from '../utils/fetch-categories.js';
import { fetchUserById } from '../utils/fetch-user-by-id.js';

import validator from 'validator';

export const index = async (req, res) => {
	try {
		const isLoggedIn = req.session && req.session.isLoggedIn ? true : false;

		const categories = await fetchCategories(); // show all categories on navbar
		const products = await fetchProducts();

		let favorites = [];
        let cartProducts = [];

		if (req.session?.user) {
			const user = await fetchUserById(req.session.user);
			if (!user) { throw new Error('User not found'); }

            cartProducts = user.cart;
			favorites = user?.favorites;
		}

		// Add the isFavorited flag to a product
		const markFavorite = (product) => ({
			...product,
			isFavorited: favorites.includes(product.slug)
		});

		const onsale = products.filter((prod) => prod.onsale).map(markFavorite);

		const recents = products
			.filter((prod) => !prod.onsale)
			.slice(0, 4)
			.map(markFavorite);

		const comuns = products
			.filter((prod) => {
				const isRecent = recents.some((r) => r.id === prod.id);
				return !prod.onsale && !isRecent;
			})
			.map(markFavorite);

		const hasProducts = onsale.length > 0 || recents.length > 0 || comuns.length > 0;

        if (req.headers['test']) {
            return res.status(200).json({ success: true, message: 'Index Loaded!' });
        }

		res.render('home/index', {
            cartProducts,
			onsale,
			recents,
			comuns,
			isLoggedIn,
			categories,
			hasProducts
		});
	} catch (error) {
        if(!req.headers['test']) {
            console.error('Error loading home page:', error);
            return req.status(500).json({ error: error.message || 'Internal server error' } );
        } else {
            return res.status(400).json({ error: error.message || 'Server error' });
        }
	}
};

export const categories = async (req, res) => {
	try {
		const { slug } = req.params;
		const isSlugValid = slug && validator.isSlug(slug);

		if (!isSlugValid) { throw new Error('Invalid category slug!'); }

		const isLoggedIn = req.session && req.session.isLoggedIn ? true : false;

		const allProducts = await fetchProducts();
		const categories = await fetchCategories();

		const sanitizedSlug = slug.trim();
		const category = categories.find((cat) => cat.slug === sanitizedSlug);

		if (!category) { throw new Error('Category not found!'); }

		let favorites = [];

		if (req.session?.user) {
			const user = await fetchUserById(req.session.user);

			if (!user) { throw new Error('User not found!'); }

			favorites = user?.favorites || [];
		}

		const products = allProducts
			.filter((prod) => prod.category?.slug === sanitizedSlug)
			.map((prod) => ({ ...prod, isFavorited: favorites.includes(prod.slug) }));

        if (req.headers['test']) {
            return res.status(200).json({ success: true, message: 'Categories Loaded!' });
        }

		res.render('home/categories', {
			isLoggedIn,
			categories,
			products,
			selectedCategory: category.title
		});
	} catch (error) {
        if(!req.headers['test']) {
            console.error(error);
            req.flash('errorMsg', error.message || 'Server error');
            return res.redirect('/');
        } else {
            return res.status(400).json({ error: error.message || 'Server error' });
        }
	}
};

export const search = async (req, res) => {
	try {
		const { query } = req.query;
		const isValidQuery =
			query &&
			typeof query === 'string' &&
			validator.isLength(query.trim(), { min: 1, max: 100 });

		if (!isValidQuery) { throw new Error('Invalid search query!'); }

		const isLoggedIn = req.session && req.session.isLoggedIn ? true : false;

		const categories = await fetchCategories();
		const allProducts = await fetchProducts();

		let favorites = [];

		if (req.session?.user) {
			const user = await fetchUserById(req.session.user);
            
            if (!user) { throw new Error('User not found!'); }

			favorites = user?.favorites || [];
		}

		const sanitizedQuery = validator.escape(query);

		const filtered = allProducts
			.filter((p) => p.title.toLowerCase().includes(sanitizedQuery.toLowerCase()) )
			.map((prod) => ({ ...prod, isFavorited: favorites.includes(prod.slug) }));

    
        if (req.headers['test']) {
            if(filtered.length === 0) {
                return res.status(404).json({ success: true, message: 'No products found!' });
            }
            return res.status(200).json({ success: true, message: 'Product Found!' });
        }

		res.render('home/search', {
			isLoggedIn,
			categories,
			products: filtered,
			searchQuery: sanitizedQuery
		});
	} catch (error) {
        if(!req.headers['test']) {
            console.error(error);
            req.flash('errorMsg', error.message || 'Server error');
            return res.redirect('/');
        } else {
            return res.status(400).json({ error: error.message || 'Server error' });
        }
	}
};
