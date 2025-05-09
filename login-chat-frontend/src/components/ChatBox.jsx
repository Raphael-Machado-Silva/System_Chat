import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ChatBox = ({ selectedUser }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    if (!selectedUser) return;

    // Conecta ao Socket.io
    socketRef.current = io('http://localhost:5000');
    
    // Registra o usuário
    socketRef.current.emit('register', user.id);

    // Gera a chave única para esta conversa
    const chatKey = [user.id, selectedUser.id].sort().join('-');
    
    // Solicita histórico ao mudar de usuário
    socketRef.current.emit('request-chat-history', { chatKey });

    // Escuta atualizações de mensagens
    socketRef.current.on('chat-history', ({ messages: history }) => {
      setMessages(history || []);
    });

    socketRef.current.on('update-chat', ({ chatKey: updatedKey, messages }) => {
      const currentKey = [user.id, selectedUser.id].sort().join('-');
      if (updatedKey === currentKey) {
        setMessages(messages);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user.id, selectedUser]); // Recarrega quando selectedUser muda

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      socketRef.current.emit('private-message', {
        receiverId: selectedUser.id,
        message,
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.senderId === user.id ? 'sent' : 'received'}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Digite uma mensagem..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatBox;