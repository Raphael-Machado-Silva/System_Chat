const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Armazena TODAS as mensagens (persiste até o servidor reiniciar)
const chatHistory = {};

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log(`[Socket.io] Usuário conectado: ${socket.id}`);

  // Registra o ID do usuário
  socket.on('register', (userId) => {
    socket.userId = userId;
    console.log(`[Socket.io] Usuário ${userId} registrado.`);
  });

  // Recebe mensagem privada
  socket.on('private-message', ({ receiverId, message }) => {
    const senderId = socket.userId;
    const chatKey = [senderId, receiverId].sort().join('-');

    // Armazena a mensagem
    if (!chatHistory[chatKey]) chatHistory[chatKey] = [];
    chatHistory[chatKey].push({ 
      senderId, 
      message, 
      timestamp: new Date() 
    });

    // Envia para o destinatário (se online)
    const receiverSocket = Array.from(io.sockets.sockets.values()).find(
      (s) => s.userId === receiverId
    );
    if (receiverSocket) {
      receiverSocket.emit('private-message', { senderId, message });
    }

    // Atualiza o chat para AMBOS os usuários
    io.emit('update-chat', { 
      chatKey, 
      messages: chatHistory[chatKey] 
    });
  });

  // Envia histórico quando solicitado
  socket.on('request-chat-history', ({ chatKey }) => {
    socket.emit('chat-history', { 
      chatKey, 
      messages: chatHistory[chatKey] || [] 
    });
  });
});

server.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});