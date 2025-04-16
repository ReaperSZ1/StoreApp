import { fetchProducts } from '../utils/fetchProducts.js';
import { fetchCategories } from '../utils/fetchCategories.js';

export const index = async (req, res) => {
    try {
        const isLoggedIn = req.session.isLoggedIn ? true : false;
    
        const categories = await fetchCategories(); 
        const products = await fetchProducts();

        const onsale = products.filter(prod => prod.onsale);
        const recents = products.filter(prod => !prod.onsale).slice(0, 4); // 4 primeiros mais recentes
        const comuns = products.filter(prod => {
            const isRecent = recents.some(r => r.id === prod.id);
            return !prod.onsale && !isRecent;
        });
        const hasProducts = onsale.length > 0 || recents.length > 0 || comuns.length > 0;

        res.render('index', { 
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
    
        const categories = await fetchCategories();  
        const category = categories.find(cat => cat.slug === slug);

        if (!category) {
            req.flash('errorMsg', 'Category not found!');
            return res.redirect('/');
        }

        const allProducts = await fetchProducts();
        const products = allProducts.filter(prod => prod.category.slug === slug);

        if (!category) {
            req.flash('errorMsg', 'Category not found!');
            return res.redirect('/');
        }

        res.render('index', {
            categories,
            products,
            selectedCategory: category.title
        });
    } catch (err) {
        console.error(err);
        res.render('error', { message: 'Erro ao buscar produtos por categoria' });
    }
};
