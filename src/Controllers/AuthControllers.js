import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		// Verifica se o usuário já existe
		const userExists = await User.findOne({ where: { email } });
		if (userExists) {
			req.flash('errorMsg', 'User already exists'); // Mensagem de erro flash
			return res.redirect('/'); // Redireciona de volta para a página inicial
		}
		// Cria o novo usuário
		const user = await User.create({ name, email, password });

		// Gera o token JWT
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: '1h'
		});

		// Envia o token como um cookie (com as flags HttpOnly e Secure)
		res.cookie('authToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // Só envia o cookie em ambientes seguros (como HTTPS)
			maxAge: 3600000 // 1 hora
		});

		req.flash('successMsg', 'User registered successfully!');
		return res.redirect('/'); 
	} catch (error) {
		console.error(error);
		req.flash('errorMsg', 'Server error'); // Mensagem de erro flash
		return res.redirect('/'); // Redireciona para a página inicial em caso de erro
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Verifica se o usuário existe
		const user = await User.findOne({ where: { email } });
		if (!user) {
			req.flash('errorMsg', 'Invalid credentials'); // Mensagem de erro flash
			return res.redirect('/'); // Redireciona para a página inicial
		}

		// Verifica a senha
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			req.flash('errorMsg', 'Invalid credentials'); // Mensagem de erro flash
			return res.redirect('/'); // Redireciona para a página inicial
		}

		// Gera o token JWT
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: '1h'
		});

		// Envia o token como um cookie
		res.cookie('authToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 3600000 // 1 hora
		});

		// Mensagem de sucesso
		req.flash('successMsg', 'Logged in successfully!');
		return res.redirect('/'); // Redireciona para a página inicial com sucesso
	} catch (error) {
		console.error('Error during login process:', error); // Log mais detalhado
		req.flash('errorMsg', 'Server error'); // Mensagem de erro flash
		return res.redirect('/'); // Redireciona para a página inicial em caso de erro
	}
};
