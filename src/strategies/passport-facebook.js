import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../models/User.js';
import validator from 'validator';

dotenv.config();

passport.use('facebook-signup', new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_SIGNUP_URL,
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const name = validator.escape(profile.displayName || '');
        const email = validator.normalizeEmail(profile.emails[0].value);
        
        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            if (existingUser.provider === 'facebook') {
                return done(null, false, { message: 'This account was created with Facebook' });
            }
            return done(null, false, { message: 'User already exists.' });
        }

        const user = await User.create({
            name: name,
            email: email,
            facebookId: profile.id,
            password: 'facebook-login',
            provider: 'facebook'
        });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use('facebook-login', new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_LOGIN_URL,
    profileFields: ['id', 'displayName', 'emails'],
    state: true 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = validator.normalizeEmail(profile.emails[0].value);

        const user = await User.findOne({ where: { email: email, provider: 'facebook' } });

        if (!user) {
            return done(null, false, { message: 'User not found. Please sign up first.' });
        }

        if (user.provider !== 'facebook') {
            return done(null, false, { message: 'This account was not created with Facebook.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));