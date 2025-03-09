class HomeController {
    static async index(req, res) {
        try {
            res.render('index');
        } catch (error) {
            console.error('Erro ao carregar a página inicial:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default HomeController;
