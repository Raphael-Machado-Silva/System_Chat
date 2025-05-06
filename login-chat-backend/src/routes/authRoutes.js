const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const users = require('../users'); // Vamos importar os usuários para essa rota

// Rota de login
router.post('/login', login);

// Nova rota para listar usuários
router.get('/users', (req, res) => {
  // Aqui você pode adicionar qualquer lógica de autenticação ou autorização, se necessário
  res.json(users);  // Retorna a lista de usuários
});

module.exports = router;
