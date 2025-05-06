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

// Middleware para exibir os logs das requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`); // Exibe o método e a URL das requisições
  next(); // Continue com o próximo middleware ou rota
});

// Middleware
app.use(cors());
app.use(express.json());

// Adicionando logs para ver se o servidor está configurado corretamente
app.use('/api/auth', (req, res, next) => {
  console.log('Requisição para /api/auth', req.method, req.url);
  next();
});
app.use('/api/auth', authRoutes);

// Rota raiz
app.get('/', (req, res) => {
  console.log('Acessou a rota /'); // Ver quando a rota raiz for acessada
  res.send('API está rodando...');
});

// Socket.io
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log(`[Socket.io] Usuário conectado: ${socket.id}`);

  socket.on('join', (username) => {
    onlineUsers.push({ id: socket.id, username });
    console.log(`[Socket.io] Usuário ${username} entrou no chat.`);
    io.emit('users', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.id !== socket.id);
    console.log(`[Socket.io] Usuário desconectado: ${socket.id}`);
    io.emit('users', onlineUsers);
  });

  socket.on('message', (message) => {
    console.log(`[Socket.io] Mensagem recebida: ${message}`);
    io.emit('message', message);
  });
});

// Inicializa o servidor
server.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
