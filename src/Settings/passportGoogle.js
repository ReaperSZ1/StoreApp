import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js'; 

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8081/auth/google/callback',
  },
  async (token, tokenSecret, profile, done) => {
    try {
      // Verifica se o usuário já existe no banco de dados
      let user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (!user) {
        // Cria um novo usuário se não encontrar no banco de dados
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });
      }
      // Retorna o usuário para a sessão
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

