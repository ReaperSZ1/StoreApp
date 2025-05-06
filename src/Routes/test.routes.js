import express from 'express';

const router = express.Router();

router.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

router.get('/simulate-invalid-session', (req, res) => {
    req.session.user = '123invalidUserId';
    res.status(200).json({ message: 'Invalid session user set' });
});

export default router;
