import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    const token = req.cookies.authToken; 

    if (!token) {
        req.user = null; // is not logged in
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error('Invalid token', err);
        req.user = null; 
        next();
    }
};


