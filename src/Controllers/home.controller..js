import { fetchProducts } from '../utils/fetchProducts.js';
import { fetchCategories } from '../utils/fetchCategories.js';
import { fetchUserById } from '../utils/fetchUserById.js';

import validator from 'validator';

export const index = async (req, res) => {
    try {
        const isLoggedIn = req.session && req.session.isLoggedIn ? true : false;

        const categories = await fetchCategories(); 
        const products = await fetchProducts();
      
        let favorites = [];
        let userId = null;

        if (req.session?.user) {
            const user = await fetchUserById(req.session.user);
            userId = req.session.user;
            favorites = user?.favorites || [];
        }

        const onsale = products
            .filter(prod => prod.onsale)
            .map(prod => ({ ...prod, isFavorited: favorites.includes(prod.slug), }));
        const recents = products
            .filter(prod => !prod.onsale).slice(0, 4)
            .map(prod => ({ ...prod, isFavorited: favorites.includes(prod.slug), }));
        const comuns = products
            .filter(prod => {
                const isRecent = recents.some(r => r.id === prod.id);
                return !prod.onsale && !isRecent;
            })
            .map(prod => ({ ...prod, isFavorited: favorites.includes(prod.slug), }));

        const hasProducts = onsale.length > 0 || recents.length > 0 || comuns.length > 0;

        res.render('home/index', { 
            userId,
            onsale, 
            recents, 
            comuns,
            isLoggedIn,
            categories,
            hasProducts 
        });
    } catch (error) {
        console.error('Erro ao carregar a página inicial:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const categories = async (req, res) => { 
    try {
        const { slug } = req.params;

        if (!slug || !validator.isSlug(slug)) {
            req.flash('errorMsg', 'Invalid category slug!');
            return res.redirect('/');
        }
        const sanitizedSlug = validator.escape(slug);
        const isLoggedIn = req.session && req.session.isLoggedIn;

        const categories = await fetchCategories();  
        const category = categories.find(cat => cat.slug === sanitizedSlug);
        const allProducts = await fetchProducts();
        
        let favorites = [];
        let userId = null;

        if (req.session?.user) {
            const user = await fetchUserById(req.session.user);
            userId = req.session.user;
            favorites = user?.favorites || [];
        }

        if (!category) {
            req.flash('errorMsg', 'Category not found!');
            return res.redirect('/');
        }
        const products = allProducts
            .filter(prod => prod.category.slug === sanitizedSlug)
            .map(prod => ({ ...prod, isFavorited: favorites.includes(prod.slug), }));

        res.render('home/categories', {
            userId,
            isLoggedIn,
            categories,
            products,
            selectedCategory: category.title
        });

    } catch (error) {
        console.error('Erro na rota de categorias:', error);
        req.flash('errorMsg', 'Erro ao carregar produtos da categoria!');
        return res.redirect('/');
    }
};

export const search = async (req, res) => { 
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string' || !validator.isLength(q, { min: 1, max: 100 })) {
            req.flash('errorMsg', 'Invalid search query!');
            return res.redirect('/');
        }

        const sanitizedQuery = validator.escape(q);
        const isLoggedIn = req.session && req.session.isLoggedIn ? true : false;

        const categories = await fetchCategories(); 
        const allProducts = await fetchProducts();

        let favorites = [];
        let userId = null;

        if (req.session?.user) {
            const user = await fetchUserById(req.session.user);
            userId = req.session.user;
            favorites = user?.favorites || [];
        }

        const filtered = allProducts
            .filter(p => p.title.toLowerCase().includes(sanitizedQuery.toLowerCase()))
            .map(prod => ({ ...prod, isFavorited: favorites.includes(prod.slug), }));

        res.render('home/search', {
            userId,
            isLoggedIn,
            categories,
            products: filtered,
            searchQuery: sanitizedQuery,
        });
    } catch (err) {
        console.error('Erro ao realizar a busca:', err);
        res.render('error', { message: 'Erro ao realizar a busca' });
    }
};
