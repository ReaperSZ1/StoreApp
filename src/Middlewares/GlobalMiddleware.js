class GlobalMiddleware {
    static setGlobals(req, res, next) {
        const success = req.query.successMsg || req.flash('successMsg');
        const error = req.query.errorMsg || req.flash('errorMsg');

        res.locals.successMsg = Array.isArray(success) ? success : [success];
        res.locals.errorMsg = Array.isArray(error) ? error : [error];
        res.locals.isLoggedIn = req.session.isLoggedIn || false;
        res.locals.user = req.session.user || null;
        res.locals.csrfToken = req.csrfToken();
        next();
    }
}

export default GlobalMiddleware;
