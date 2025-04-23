import { fetchUserById, updateUserFavorites } from '../utils/fetch-user-by-id.js';
import { fetchProducts } from '../utils/fetch-products.js';
import { fetchCategories } from '../utils/fetch-categories.js';

export const getFavorites = async (req, res) => {
	try {
        const userId = req.session.user;

        const user = await fetchUserById(userId);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const favorites = user.favorites || [];

		return res.json({ favorites });
	} catch (err) {
		console.error('Error fetching favorites:', err);
		return res.status(500).json({ error: 'Error fetching favorites' });
	}
};

export const postFavorites = async (req, res) => {
	try {
        const userId = req.session.user;
		const { favorites } = req.body;

		if (!userId) {
			req.flash('errorMsg', 'invalid userId!');
			return res.redirect('/');
		}

        if(!Array.isArray(favorites)) {
            req.flash('errorMsg', 'favorites must be an array!');
            return res.redirect('/');
        }

		await updateUserFavorites(userId, favorites);

		return res.json({ success: true });
	} catch (err) {
		console.error('Error while saving favorites:', err);
		return res.status(500).json({ error: 'Error while saving favorites' });
	}
};

export const userFavorites = async (req, res) => {
	try {
		const userId = req.session.user;

		if (!userId) {
			req.flash('errorMsg', 'You need to be logged in to see your favorites');
			return res.redirect('/');
		}

		const categories = await fetchCategories();
		const allProducts = await fetchProducts();
		const user = await fetchUserById(userId);

		const favoriteProducts = allProducts
			.filter((product) => user.favorites.includes(product.slug))
			.map((p) => ({ ...p, isFavorited: true }));

		res.render('favorites', { favoriteProducts, categories });
	} catch (err) {
		console.error('Error rendering user favorites:', err);
		res.status(500).send('Error loading favorites');
	}
};
