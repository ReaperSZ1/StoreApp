import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';

export const signUp = async (req, res) => {
	try {
		const { name, email, password, password2 } = req.body;

		const sanitizedName = validator.escape(name);
		const sanitizedEmail = validator.normalizeEmail(email);
		const sanitizedPassword = validator.escape(password);
		const sanitizedPassword2 = validator.escape(password2);

		if (sanitizedPassword !== sanitizedPassword2) {
			throw new Error('Passwords do not match');
		}

		if (!validator.isEmail(sanitizedEmail)) {
			throw new Error('Invalid email');
		}

		if (!validator.isLength(sanitizedPassword, { min: 6 })) {
			throw new Error('Password must be at least 6 characters');
		}

		const userExists = await User.findOne({ where: { email: sanitizedEmail } });

		if (userExists) {
			throw new Error('User Email already exists');
		}

		const user = await User.create({
			name: sanitizedName,
			email: sanitizedEmail,
			password: sanitizedPassword
		});

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: '1h'
		});

		// Send the token as a cookie (with HttpOnly and Secure flags)
		res.cookie('authToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // Only send the cookie over secure connections (like HTTPS) in production environments
			maxAge: 3600000 // 1 hour
		});

		if (req.headers['e2e']) {
			await user.destroy();
            // wasn't used req.session save for req.flash because it was giving an error in the e2e tests
            req.flash('successMsg', 'User registered successfully!');
            return res.redirect('/');
		}
        
		req.session.user = user.id;
		req.session.isLoggedIn = true;
        console.log('sessao criada', req.session); 

		if (req.headers['test']) {
			await user.destroy();
			return res.status(200).json({
				success: true,
				message: 'User created and removed for test'
			});
		}

        req.flash('successMsg', 'User registered successfully!');
        req.session.save((err) => {
            if (err) {
                throw new Error('Error saving flash message:', err);
            }
            return res.redirect('/');
        });
		
	} catch (error) {
		if (!req.headers['test']) {
			console.error(error);
			req.flash('errorMsg', error.message || 'Server error');
			req.session.save((err) => {
				if (err) {
                    throw new Error('Error saving flash message:', err);
                }
				return res.redirect('/');
			});
		} else {
			return res.status(400).json({ error: error.message || 'Server error' });
		}
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const sanitizedEmail = validator.normalizeEmail(email);
		const sanitizedPassword = validator.escape(password);

		if (!validator.isEmail(sanitizedEmail)) {
			throw new Error('Invalid email');
		}

		if (!validator.isLength(sanitizedPassword, { min: 6 })) {
			throw new Error('Password must be at least 6 characters');
		}

		const user = await User.findOne({ where: { email: sanitizedEmail } });

		if (!user) {
			throw new Error('User Not Found');
		}

		const isMatch = await user.comparePassword(password);

		if (!isMatch) {
			throw new Error('Invalid credentials');
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: '1h'
		});

		res.cookie('authToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 3600000 // 1 hour
		});

		req.session.user = user.id;
		req.session.isLoggedIn = true;
        console.log('sessao criada', req.session); 

		if (req.headers['test']) {
			return res
				.status(200)
				.json({ success: true, message: 'Logged in successfully!' });
		}
		// this ensures the page is only loaded when the session is correctly saved
        req.flash('successMsg', 'Logged in successfully!');
        return res.redirect('/');

        // req.session.save((err) => {
        //     if (err) {
        //         throw new Error('Error saving flash message:', err);
        //     }
        //     return res.redirect('/');
        // });
	
	} catch (error) {
		if (!req.headers['test']) {
			console.error(error);

			req.flash('errorMsg', error.message || 'Server error');
			req.session.save((err) => {
				if (err) {
                    throw new Error('Error saving flash message:', err);
				}
				return res.redirect('/');
			});
		} else {
			return res.status(400).json({ error: error.message || 'Server error' });
		}
	}
};

export const logout = (req, res) => {
	try {
		const isOAuth = !!req.user; // If req.user exists, probably it was an OAuth login

		const logoutMsg = encodeURIComponent('You have been logged out!'); // Success message

		if (isOAuth && typeof req.logout === 'function') {
			// OAuth logout
			req.logout((err) => {
				if (err) {
					throw new Error('Error logging out', err);
				}

				// Remove session after OAuth logout
				req.session.destroy(() => {
					res.clearCookie('connect.sid');
					res.clearCookie('authToken'); // Remove JWT token if exists
					if (req.headers['test']) {
						return res
							.status(200)
							.json({ success: true, message: 'You have been logged out!' });
					}
					return res.redirect(`/?successMsg=${logoutMsg}`);
				});
			});
		} else {
			// Remove session after local logout
			req.session.destroy(() => {
				res.clearCookie('connect.sid');
				res.clearCookie('authToken');
				if (req.headers['test']) {
					return res
						.status(200)
						.json({ success: true, message: 'You have been logged out!' });
				}
				return res.redirect(`/?successMsg=${logoutMsg}`);
			});
		}
	} catch (error) {
		if (!req.headers['test']) {
			console.error(error);
			const errorMsg = encodeURIComponent('Error logging out');
			return res.redirect(`/?errorMsg=${errorMsg}`);
		} else {
			return res.status(400).json({ error: error.message || 'Server error' });
		}
	}
};
