import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js';
import validator from 'validator';

dotenv.config();

passport.use(
	'google-signup',
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_SIGNUP_URL,
			state: true
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const name = validator.escape(profile.displayName || '');
				const email = validator.normalizeEmail(profile.emails[0].value);

				const existingUser = await User.findOne({ where: { email: email } });

				if (existingUser) {
					if (existingUser.provider === 'google') {
						return done(null, false, {
							message: 'This account was created with google'
						});
					}

					return done(null, false, { message: 'User already exists.' });
				}

				const user = await User.create({
					name: name,
					email: email,
					googleId: profile.id,
					password: 'google-login',
					provider: 'google'
				});

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);

passport.use(
	'google-login',
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_LOGIN_URL
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const email = validator.normalizeEmail(profile.emails[0].value);

				const user = await User.findOne({
					where: { email: email, provider: 'google' }
				});

				if (!user) {
					return done(null, false, {
						message: 'User not found. Please sign up first.'
					});
				}

				if (user.provider !== 'google') {
					return done(null, false, {
						message: 'This account was not created with Google.'
					});
				}

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findByPk(id);
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});
