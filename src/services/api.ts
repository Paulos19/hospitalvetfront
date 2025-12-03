import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// A NOVA URL DE PRODUÇÃO
const API_URL = 'https://hospitalvetbackend-7jyy.vercel.app/api'; 

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});