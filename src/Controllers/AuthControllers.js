import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res) => {
	const { name, email, password, password2 } = req.body;

	try {
        if(password !== password2) {
            req.flash('errorMsg', 'Passwords do not match');
            return res.redirect('/');
        }
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

        req.session.user = user.id;  
        req.session.isLoggedIn = true; 
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

        req.session.user = user.id;  
        req.session.isLoggedIn = true; 
		req.flash('successMsg', 'Logged in successfully!');
		return res.redirect('/'); 
	} catch (error) {
		console.error('Error during login process:', error); 
		req.flash('errorMsg', 'Server error'); 
		return res.redirect('/'); 
	}
};

export const logout = (req, res) => {
    const isOAuth = !!req.user; // If req.user exists, probably it was an OAuth login

    // Success message
    const logoutMsg = encodeURIComponent('You have been logged out');

    // Common callback to redirect with message
    const redirectWithMsg = () => {
        res.clearCookie('authToken'); // Remove JWT token if exists
        return res.redirect(`/?successMsg=${logoutMsg}`);
    };

    if (isOAuth && typeof req.logout === 'function') {
        // OAuth logout
        req.logout((err) => {
            if (err) {
                console.error('Logout error:', err);
                const errorMsg = encodeURIComponent('Error logging out');
                return res.redirect(`/?errorMsg=${errorMsg}`);
            }

            // Remove session after OAuth logout
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                return redirectWithMsg();
            });
        });
    } else {
        // Remove session after local logout
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return redirectWithMsg();
        });
    }
};

