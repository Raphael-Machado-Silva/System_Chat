const express = require('express');
const { login, getUsers } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.get('/users', getUsers); // Rota GET para listar usuários

module.exports = router;