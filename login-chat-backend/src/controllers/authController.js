const jwt = require('jsonwebtoken');
const users = require('../users');

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username e password são obrigatórios' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const payload = { 
      id: user.id, 
      username: user.username,
      // Adicione outros dados do usuário se necessário
    };
    
    const token = jwt.sign(payload, 'secreto', { expiresIn: '1h' });
    
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
};

module.exports = { login };