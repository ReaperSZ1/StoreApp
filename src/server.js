import app from './app.js';

const PORT = 8081;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
	if (ENV === 'development') {
		console.log(`🚀 Servidor rodando localmente em http://localhost:${PORT}`);
	} else {
		console.log(`🌍 Servidor rodando em ambiente remoto`);
	}
});

