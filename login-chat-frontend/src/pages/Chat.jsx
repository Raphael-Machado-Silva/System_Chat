import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserList from '../components/UserList';

const Chat = () => {
  const { user, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <p>Logado como: <strong>{user.username}</strong></p>
        <button onClick={logout}>Sair</button>
      </header>

      <div className="chat-body">
        <UserList onSelectUser={setSelectedUser} />
        
        <div className="message-area">
          {selectedUser ? (
            <div>
              <h4>Conversando com: {selectedUser.username}</h4>
              {/* Implementar ChatBox aqui */}
            </div>
          ) : (
            <p>Selecione um usuário para conversar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;