const jwt = require('jsonwebtoken');
const users = require('../users'); // Supondo que você tenha uma lista de usuários
require('dotenv').config();

// Função para login
const login = (req, res) => {
  console.log('Dados recebidos:', req.body); // Verifique se os dados chegam
  const { username, password } = req.body;

  // Verifique se os campos estão preenchidos
  if (!username || !password) {
    return res.status(400).json({ message: 'Username e senha são obrigatórios' });
  }

  // Encontrar o usuário correspondente
  const user = users.find(u => u.username === username && u.password === password);
  console.log('Usuário encontrado:', user); // Verifique se o usuário existe

  // Verifique se a variável de ambiente está carregada corretamente
  console.log('JWT_SECRET:', process.env.JWT_SECRET); // Aqui você vê a chave secreta

  // Se o usuário for encontrado, gere o token
  if (user) {
    // Usando a chave secreta do .env ou a chave temporária de fallback
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secreto_fallback',  // Fallback para chave temporária
      { expiresIn: '1h' }  // Token expira após 1 hora
    );

    // Retornar o token para o cliente
    res.json({ token });
  } else {
    // Se as credenciais estiverem incorretas
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
};

// Função para listar os usuários
const getUsers = (req, res) => {
  try {
    // Retorna a lista de usuários sem as senhas (por segurança)
    const usersList = users.map(user => ({
      id: user.id,
      username: user.username,
      isOnline: false // Você pode atualizar isso com Socket.io depois
    }));
    res.json(usersList);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Exporta as funções login e getUsers
module.exports = { login, getUsers };
