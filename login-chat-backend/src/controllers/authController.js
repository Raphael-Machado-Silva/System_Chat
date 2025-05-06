// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const users = require('../users');

// Gerar o JWT
const generateToken = (username) => {
  return jwt.sign({ username }, 'secreta', { expiresIn: '1h' });
};

// Verificar se o usuário existe e validar a senha
const login = (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  // Compara a senha em texto simples
  if (password !== user.password) {
    return res.status(400).json({ message: 'Senha incorreta' });
  }

  // Gera o token JWT
  const token = generateToken(user.username);
  return res.json({ token });
};

module.exports = { login };
