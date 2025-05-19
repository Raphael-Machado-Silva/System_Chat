import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import './Login.css'; // Importe o CSS externo

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error('Resposta não é JSON:', text);
        throw new Error('Resposta inválida do servidor');
      }
  
      if (response.ok) {
        const token = data.token;
        const userData = jwtDecode(token);
        login(userData, token);
        navigate('/chat');
      } else {
        alert(data.message || 'Erro na autenticação');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Servidor indisponível ou erro inesperado. Verifique o console.');
    }
  };

  return (
    <div className="login-container">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <h3>Login</h3>
        <label htmlFor="username">Usuário</label>
        <input
          type="text"
          placeholder="Digite seu usuário"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          placeholder="Digite sua senha"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;