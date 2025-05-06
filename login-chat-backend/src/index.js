// src/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Ajuste conforme seu frontend
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Adicionando console.log para ver as requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); // Exibe o método e a URL das requisições
  next(); // Continue com o próximo middleware ou rota
});

// Rotas
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  console.log('Acessou a rota /'); // Ver quando a rota raiz for acessada
  res.send('API está rodando...');
});

// Socket.io
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('Um usuário conectado:', socket.id);

  socket.on('join', (username) => {
    onlineUsers.push({ id: socket.id, username });
    console.log(`Usuário ${username} entrou no chat.`);
    io.emit('users', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.id !== socket.id);
    console.log('Um usuário se desconectou:', socket.id);
    io.emit('users', onlineUsers);
  });

  socket.on('message', (message) => {
    io.emit('message', message);
  });
});

// Inicializa o servidor
server.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
