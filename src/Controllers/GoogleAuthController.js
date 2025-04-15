import passport from 'passport';

export const googleSignup = passport.authenticate('google-signup', {
    scope: ['profile', 'email']
});

export const googleSignupCallback = (req, res, next) => {
    passport.authenticate('google-signup', (err, user, info) => {
        if (err) { return next(err); }
    
        if (!user) {
            req.flash('errorMsg', info.message);
            return res.redirect('/');
        }
      
        req.login(user, (err) => {
            if (err) { return next(err); }
            req.session.isLoggedIn = true;
            req.flash('successMsg', 'Signed up successfully!');
            return res.redirect('/');
        });
    })(req, res, next);
};

export const googleLogin = passport.authenticate('google-login', {
    scope: ['profile', 'email']
});

export const googleLoginCallback = (req, res, next) => {
    passport.authenticate('google-login', (err, user, info) => {
        if (err) { return next(err); }
    
        if (!user) {
            req.flash('errorMsg', info.message);
            return res.redirect('/');
        }
        
        req.login(user, (err) => {
            if (err) { return next(err); }
            req.session.isLoggedIn = true;
            req.flash('successMsg', 'Signed up successfully!');
            return res.redirect('/');
        });
    })(req, res, next);
};

