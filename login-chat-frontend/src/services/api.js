// src/services/api.js
const API_URL = 'http://localhost:5000/api/auth'; // URL do seu servidor

// Função para fazer login
export const login = async (username, password) => {
  console.log("Enviando requisição de login para o servidor...");

  // Envia a requisição para o backend
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
    },
    body: JSON.stringify({ username, password }), // Envia as credenciais como JSON
  });

  // Verifica se a resposta não foi bem-sucedida
  if (!response.ok) {
    throw new Error('Login falhou');
  }

  // Parseia a resposta JSON
  const data = await response.json();
  console.log("Resposta do servidor:", data); // Log para ver a resposta completa do servidor

  // Verifica se a resposta contém 'user' e 'token'
  if (!data.user || !data.token) {
    console.error("Erro: Dados incompletos na resposta.");
    throw new Error('Dados incompletos na resposta');
  }

  // Retorna o usuário e o token recebidos
  return { user: data.user, token: data.token };
};
