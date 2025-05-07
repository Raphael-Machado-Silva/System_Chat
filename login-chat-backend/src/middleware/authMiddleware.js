const jwt = require('jsonwebtoken');

// Middleware para autenticação via token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extrai o token do cabeçalho

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // Verifica o token
  jwt.verify(token, 'secreto', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    
    req.user = user;  // Anexa as informações do usuário na requisição
    next();  // Passa para o próximo middleware ou rota
  });
};

// Agora você pode usar esse middleware para proteger suas rotas
app.get('/chat', authenticateToken, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}!` }); // Acesso liberado, exibe o nome do usuário
});
