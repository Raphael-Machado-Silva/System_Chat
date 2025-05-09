import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/users');
        const data = await response.json();
        setUsers(data.filter(user => user.id !== currentUser.id));
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };
    fetchUsers();
  }, [currentUser]);

  return (
    <div className="user-list">
      <h3>Usuários</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => onSelectUser(user)}
            style={{ color: user.isOnline ? 'green' : 'gray' }}
          >
            {user.username} {user.isOnline ? '🟢' : '⚪'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;