import express from 'express';
import {
    facebookSignup,
    facebookSignupCallback,
    facebookLogin,
    facebookLoginCallback
} from '../Controllers/facebook.controller.js';

const router = express.Router();

router.get('/auth/facebook/signup', facebookSignup);
router.get('/auth/facebook/signup/callback', facebookSignupCallback);

router.get('/auth/facebook/login', facebookLogin);
router.get('/auth/facebook/login/callback', facebookLoginCallback);

export default router;
