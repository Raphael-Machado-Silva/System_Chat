const jwt = require('jsonwebtoken');
const users = require('../users');

// Login
const login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
};

// Lista de usuários
const getUsers = (req, res) => {
  const usersList = users.map(user => ({
    id: user.id,
    username: user.username,
    isOnline: false, // Pode ser atualizado via Socket.io depois
  }));
  res.json(usersList);
};

module.exports = { login, getUsers };