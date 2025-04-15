import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

passport.use('facebook-signup', new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:8081/auth/facebook/signup/callback',
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({
            where: { email: profile.emails[0].value }
        });

        if (existingUser) {
            if (existingUser.provider === 'facebook') {
                return done(null, false, { message: 'This account was created with Facebook' });
            }
            return done(null, false, { message: 'User already exists.' });
        }

        const user = await User.create({
            name: profile.displayName,
            email: profile.emails[0]?.value,
            googleId: profile.id,
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
    callbackURL: 'http://localhost:8081/auth/facebook/login/callback',
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ where: { email: profile.emails[0].value, provider: 'facebook' } });

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