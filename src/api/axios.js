import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Ton backend
  headers: { 'Content-Type': 'application/json' }
});

// Ajouter le token automatiquement
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;