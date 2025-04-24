import express from 'express';
import {
    googleSignup,
    googleSignupCallback,
    googleLogin,
    googleLoginCallback
} from '../Controllers/google.controller.js';

const router = express.Router();

router.get('/auth/google/signup', googleSignup);
router.get('/auth/google/signup/callback', googleSignupCallback);

router.get('/auth/google/login', googleLogin);
router.get('/auth/google/login/callback', googleLoginCallback);

export default router;
