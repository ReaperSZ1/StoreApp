import passport from 'passport';

// Inicia a autenticação com o Google
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Callback do Google após login
export const googleCallback = passport.authenticate('google', {
  failureRedirect: '/'
});

// Após autenticação bem-sucedida
export const redirectAfterLogin = (req, res) => {
    req.session.isLoggedIn = true;  
    req.flash('successMsg', 'Login successfully!'); 
    res.redirect('/'); 
};

