import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

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
  
      // Verifica se a resposta é JSON válido
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text); // Tenta parsear o JSON
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
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