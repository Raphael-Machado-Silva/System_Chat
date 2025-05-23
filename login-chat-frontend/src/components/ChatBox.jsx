import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import './ChatBox.css'; // Arquivo CSS que vamos criar

const ChatBox = ({ selectedUser }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef();

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
  }, [user.id, selectedUser]);

  // Rolagem automática para a última mensagem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    <div className="chat-box-container">
      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{msg.message}</p>
                <span className="message-time">
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-messages">
            <p>Nenhuma mensagem ainda. Envie uma mensagem para iniciar a conversa!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Digite sua mensagem..."
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;