import { fetchProducts } from '../utils/products.js';

export default class HomeController {
	static async index(req, res) {
		try {
            const isLoggedIn = req.user ? true : false;
			const products = await fetchProducts();
            const onsale = products.filter(prod => prod.onsale);
            const recents = products.filter(prod => !prod.onsale).slice(0, 4); // 4 primeiros mais recentes
            const comuns = products.filter(prod => {
                const isRecent = recents.some(r => r.id === prod.id);
                return !prod.onsale && !isRecent;
            });
            res.render('index', { 
                onsale, 
                recents, 
                comuns,
                isLoggedIn,   
                user: req.user 
            });
		} catch (error) {
			console.error('Erro ao carregar a página inicial:', error);
			res.status(500).json({ error: 'Erro interno do servidor' });
		}
	}
}

