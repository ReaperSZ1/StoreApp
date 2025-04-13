import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

// Middleware de autenticação para proteger rotas
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Guarda o ID do usuário no objeto da requisição
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Token is not valid' });
  }
};
