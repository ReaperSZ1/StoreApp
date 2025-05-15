import passport from 'passport';

export const facebookSignup = passport.authenticate('facebook-signup', {
    scope: ['email']
});

export const facebookSignupCallback = (req, res, next) => {
    passport.authenticate('facebook-signup', (err, user, info) => {
        if (err) { return next(err); }

        if (!user) {
            req.flash('errorMsg', info.message);
            req.session.save((err) => {
                if (err) { console.error('Error saving flash message:', err); }
                return res.redirect('/');
            });
        }

        req.login(user, (err) => {
            if (err) { return next(err); }
            req.session.user = user.id;
            req.session.isLoggedIn = true;

            req.session.save((err) => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.redirect('/');
                }
            
                req.flash('successMsg', 'Signed up successfully!');
                req.session.save((err) => {
                    if (err) {
                        console.error('Error saving flash message:', err);
                    }
                    return res.redirect('/');
                });
            });
        });
    })(req, res, next);
};

export const facebookLogin = passport.authenticate('facebook-login', {
    scope: ['email']
});

export const facebookLoginCallback = (req, res, next) => {
    passport.authenticate('facebook-login', (err, user, info) => {
        if (err) { return next(err); }

        if (!user) {
            req.flash('errorMsg', info.message);
            req.session.save((err) => {
                if (err) { console.error('Error saving flash message:', err); }
                return res.redirect('/');
            });
        }

        req.login(user, (err) => {
            if (err) { return next(err); }
            req.session.user = user.id;
            req.session.isLoggedIn = true;
            
            req.session.save((err) => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.redirect('/');
                }
            
                req.flash('successMsg', 'login successfully!');
                req.session.save((err) => {
                    if (err) {
                        console.error('Error saving flash message:', err);
                    }
                    return res.redirect('/');
                });
            });
        });
    })(req, res, next);
};
