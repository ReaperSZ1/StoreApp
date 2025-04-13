import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
  const token = req.cookies.authToken; // ou de req.headers.authorization, dependendo de onde está o token

  if (!token) {
    req.user = null; // Não está logado
    return next();
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Salva o user decodificado na requisição
    next();
  } catch (err) {
    console.error('Invalid token', err);
    req.user = null; // Em caso de erro, o usuário não está logado
    next();
  }
};

export default checkAuth;
