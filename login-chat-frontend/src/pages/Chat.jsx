import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserList from '../components/UserList'
import ChatBox from '../components/ChatBox';

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