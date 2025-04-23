import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';

export const signUp = async (req, res) => {
	const { name, email, password, password2 } = req.body;

    if(password !== password2) {
        req.flash('errorMsg', 'Passwords do not match');
        return res.redirect('/');
    }

    if (!validator.isEmail(email)) {
        req.flash('errorMsg', 'Invalid email');
        return res.redirect('/');
    }

    if (!validator.isLength(password, { min: 6 })) {
        req.flash('errorMsg', 'Password must be at least 6 characters');
        return res.redirect('/');
    }

	try {

		const userExists = await User.findOne({ where: { email } });

		if (userExists) {
			req.flash('errorMsg', 'User Email already exists'); 
			return res.redirect('/'); 
		}
          
		const user = await User.create({ name, email, password });

		// token jwt generating
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: '1h'
		});

		// Send the token as a cookie (with HttpOnly and Secure flags)
		res.cookie('authToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // Only send the cookie over secure connections (like HTTPS) in production environments
			maxAge: 3600000 // 1 hour
		});

        req.session.user = user.id;  
        req.session.isLoggedIn = true; 

		req.flash('successMsg', 'User registered successfully!');
		return res.redirect('/'); 
	} catch (error) {
		console.error(error);
		req.flash('errorMsg', 'Server error');
		return res.redirect('/'); 
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
    
    if (!validator.isEmail(email)) {
        req.flash('errorMsg', 'Invalid email');
        return res.redirect('/');
    }

    if (!validator.isLength(password, { min: 6 })) {
        req.flash('errorMsg', 'Password must be at least 6 characters');
        return res.redirect('/');
    }

	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			req.flash('errorMsg', 'User not found'); 
			return res.redirect('/'); 
		}

		const isMatch = await user.comparePassword(password);

		if (!isMatch) {
			req.flash('errorMsg', 'Invalid credentials');
			return res.redirect('/');
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

    const logoutMsg = encodeURIComponent('You have been logged out'); // Success message

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
                res.clearCookie('authToken'); // Remove JWT token if exists
                return res.redirect(`/?successMsg=${logoutMsg}`);
            });
        });
    } else {
        // Remove session after local logout
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.clearCookie('authToken'); // Remove JWT token if exists
            return res.redirect(`/?successMsg=${logoutMsg}`);
        });
    }
};

