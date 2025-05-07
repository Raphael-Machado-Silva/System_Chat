import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Ou um loader enquanto redireciona
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <p>Logado como: <strong>{user.username}</strong></p>
        <button onClick={logout} className="logout-button">Sair</button>
      </header>
      {/* Restante do seu chat */}
    </div>
  );
};

export default Chat;