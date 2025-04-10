import { buscarProdutos } from '../utils/dato.js';

class HomeController {
	static async index(req, res) {
		try {
			const products = await buscarProdutos();
			res.render('index', { products });
		} catch (error) {
			console.error('Erro ao carregar a página inicial:', error);
			res.status(500).json({ error: 'Erro interno do servidor' });
		}
	}
}

export default HomeController;
