import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';
import './ChatHeader.css'; // Vamos criar este arquivo para os estilos

const Chat = () => {
  const { user, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

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
        <UserList onSelectUser={setSelectedUser} />
        {selectedUser && (
          <div className="chat-area">
            <h4>Conversando com: {selectedUser.username}</h4>
            <ChatBox selectedUser={selectedUser} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;