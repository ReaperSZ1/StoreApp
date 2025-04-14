import express from 'express';
import {
  googleAuth,
  googleCallback,
  redirectAfterLogin
} from '../Controllers/GoogleAuthController.js';

const router = express.Router();

router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback, redirectAfterLogin);


export default router;
