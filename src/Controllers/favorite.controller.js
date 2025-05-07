import {
	fetchUserById,
	updateUserFavorites
} from '../utils/fetch-user-by-id.js';
import { fetchProducts } from '../utils/fetch-products.js';
import { fetchCategories } from '../utils/fetch-categories.js';

export const getFavorites = async (req, res) => {
	try {
		const userId = req.session.user;

		const user = await fetchUserById(userId);

		if (!user) { throw new Error('User not found'); }

		const favorites = user.favorites || [];

		if (req.headers['test']) {
			return res
				.status(200)
				.json({ success: true, message: 'Favorites fetched', favorites });
		}

		return res.json({ favorites });
	} catch (error) {
		console.error('Error fetching favorites:', error);
		return res
			.status(400)
			.json({ error: error.message || 'Error fetching favorites' });
	}
};

export const postFavorites = async (req, res) => {
	try {
		const userId = req.session.user;
		const { favorites } = req.body;

		if (!favorites) {
			throw new Error('cannot be empty');
		}

		if (!userId) {
			throw new Error('You need to be logged in');
		}

		if (!Array.isArray(favorites)) {
			throw new Error('Favorites must be an array!');
		}

		await updateUserFavorites(userId, favorites);

		if (req.headers['test']) {
			return res
				.status(200)
				.json({ success: true, message: 'Favorites saved' });
		}

		return res.json({ success: true });
	} catch (error) {
		if (!req.headers['test']) {
			console.error(error);
			req.flash('errorMsg', error.message || 'Error while saving favorites');
			return res.redirect('/');
		} else {
			return res
				.status(400)
				.json({ error: error.message || 'Error while saving favorites' });
		}
	}
};

export const userFavorites = async (req, res) => {
	try {
		const userId = req.session.user;

		if (!userId) {
			throw new Error('You need to be logged in to see your favorites');
		}

		const user = await fetchUserById(userId);

		if (!user) {
			throw new Error('User not found');
		}

		const categories = await fetchCategories();
		const allProducts = await fetchProducts();

		const favoriteProducts = allProducts
			.filter((product) => user.favorites.includes(product.slug))
			.map((p) => ({ ...p, isFavorited: true }));

		if (req.headers['test']) {
			return res
				.status(200)
				.json({
					success: true,
					message: 'Favorites fetched!',
					favoriteProducts
				});
		}

		res.render('favorites/index', { favoriteProducts, categories });
	} catch (error) {
		if (!req.headers['test']) {
			console.error(error);
			req.flash('errorMsg', error.message || 'Error loading favorites');
			return res.redirect('/');
		} else {
			return res
				.status(400)
				.json({ error: error.message || 'Error loading favorites' });
		}
	}
};
