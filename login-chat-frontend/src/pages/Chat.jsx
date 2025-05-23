import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';
import './ChatHeader.css';

const Chat = () => {
  const { user, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  // Função para limpar a seleção
  const handleCloseChat = () => {
    setSelectedUser(null);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>Bem vindo, <strong>{user.username}</strong></h2>
        <div className="logout-btn-container">
          <button className="logout-btn" onClick={logout}>
            <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
            </svg>
            <span className='logout'>SAIR</span>
          </button>
        </div>
      </header>

      <div className="chat-body">
        <UserList 
          onSelectUser={setSelectedUser} 
          selectedUserId={selectedUser?.id}  // Passa o ID do usuário selecionado
        />
        {selectedUser ? (
          <div className="chat-area">
            <div className="chat-header-area">
              <h4>Conversando com: <span>{selectedUser.username}</span></h4>
              <button 
                className="close-chat-btn"
                onClick={handleCloseChat}
                title="Fechar chat"
              >
                ×
              </button>
            </div>
            <ChatBox selectedUser={selectedUser} />
          </div>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <h3>Selecione um usuário para começar a conversar</h3>
              <p>Ou aguarde alguém entrar em contato com você</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;