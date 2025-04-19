import { fetchUserById, updateUserFavorites } from '../utils/fetchUserById.js';
import { fetchProducts } from '../utils/fetchProducts.js';
import { fetchCategories } from '../utils/fetchCategories.js';

// Exemplo da rota que talvez esteja faltando ou errada
export const getFavorites = async (req, res) => {
    try {
      const userId = req.params.userId;
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
    const userId = req.params.userId;
    const { favorites } = req.body;

    if (!userId || !Array.isArray(favorites)) {
        return res.status(400).json({ error: 'Invalid request' });
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
        const user = await fetchUserById(userId);
        const allProducts = await fetchProducts();
    
        const favoriteProducts = allProducts
            .filter(product => user.favorites.includes(product.slug))
            .map(p => ({ ...p, isFavorited: true }));
        
        res.render('index', {
            userId,
            favorites: true,
            favoriteProducts,
            categories,
        });
    } catch (err) {
        console.error('Error rendering user favorites:', err);
        res.status(500).send('Error loading favorites');
    }
};
  