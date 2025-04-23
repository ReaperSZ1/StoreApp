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

		if (req.session?.user) {
			const user = await fetchUserById(req.session.user);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
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

		const hasProducts =
			onsale.length > 0 || recents.length > 0 || comuns.length > 0;

		res.render('home/index', {
			onsale,
			recents,
			comuns,
			isLoggedIn,
			categories,
			hasProducts
		});
	} catch (error) {
		console.error('Error loading home page:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const categories = async (req, res) => {
	try {
		const { slug } = req.params;
		const isSlugValid = slug && validator.isSlug(slug);

		if (!isSlugValid) {
			req.flash('errorMsg', 'Invalid category slug!');
			return res.redirect('/');
		}

		const isLoggedIn = req.session && req.session.isLoggedIn ? true : false;

		const allProducts = await fetchProducts();
		const categories = await fetchCategories();

		const sanitizedSlug = slug.trim();
		const category = categories.find((cat) => cat.slug === sanitizedSlug);

		if (!category) {
			req.flash('errorMsg', 'Category not found!');
			return res.redirect('/');
		}

		let favorites = [];

		if (req.session?.user) {
			const user = await fetchUserById(req.session.user);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
			favorites = user?.favorites || [];
		}

		const products = allProducts
			.filter((prod) => prod.category?.slug === sanitizedSlug)
			.map((prod) => ({ ...prod, isFavorited: favorites.includes(prod.slug) }));

		res.render('home/categories', {
			isLoggedIn,
			categories,
			products,
			selectedCategory: category.title
		});
	} catch (error) {
		console.error('Error in category route:', error);
		req.flash('errorMsg', 'Error loading category products!');
		return res.redirect('/');
	}
};

export const search = async (req, res) => {
    try {
        const { query } = req.query;
		const isValidQuery = query && typeof query === 'string' && validator.isLength(query.trim(), { min: 1, max: 100 });

		if (!isValidQuery) {
			req.flash('errorMsg', 'Invalid search query!');
			return res.redirect('/');
		}

		const isLoggedIn = req.session && req.session.isLoggedIn ? true : false;

		const categories = await fetchCategories();
		const allProducts = await fetchProducts();

		let favorites = [];

		if (req.session?.user) {
			const user = await fetchUserById(req.session.user);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
			favorites = user?.favorites || [];
		}

		const sanitizedQuery = validator.escape(query);

		const filtered = allProducts
			.filter((p) => p.title.toLowerCase().includes(sanitizedQuery.toLowerCase()))
			.map((prod) => ({ ...prod, isFavorited: favorites.includes(prod.slug) }));

		res.render('home/search', {
			isLoggedIn,
			categories,
			products: filtered,
			searchQuery: sanitizedQuery
		});
	} catch (err) {
		console.error('Error searching for products:', err);
		req.flash('errorMsg', 'Error loading category products!');
		return res.redirect('/');
	}
};
