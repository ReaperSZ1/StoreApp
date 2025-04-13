import express from 'express';
import HomeController from '../Controllers/HomeController.js';

const router = express.Router();

router.get('/', HomeController.index);

export default router;
