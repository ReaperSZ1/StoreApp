import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js'; 

dotenv.config();

passport.use('google-signup', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8081/auth/google/signup/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ where: { email: profile.emails[0].value } });
  
      if (existingUser) {
        return done(null, false, { message: 'User already exists.' });
      }
  
      const user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        password: 'google-login',
        provider: 'google'
      });
  
      return done(null, user);
    } catch (err) {
      return done(err);
    }
}));
  
passport.use('google-login', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8081/auth/google/login/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ where: { email: profile.emails[0].value } });
  
      if (!user) {
        return done(null, false, { message: 'User not found. Please sign up first.' });
      }
  
      return done(null, user);
    } catch (err) {
      return done(err);
    }
}));
  