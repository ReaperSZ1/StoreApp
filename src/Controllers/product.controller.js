import { fetchProducts } from '../utils/fetch-products.js';
import { fetchCategories } from '../utils/fetch-categories.js';
import { fetchUserById } from '../utils/fetch-user-by-id.js';

export const product = async (req, res) => {
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

        const oneproduct = products
            .filter((prod) => !prod.onsale)
            .slice(0, 1)
            .map((prod) => ({ ...prod, isFavorited: favorites.includes(prod.slug) }));
        
        console.log(oneproduct);

        res.render('product/index', {
            oneproduct,
            isLoggedIn,
            categories,
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};