import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'VET' | 'CLIENT';
}

interface AuthState {
  user: User | null;
  token: string | null;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  signIn: async (token, user) => {
    // Apenas salva os dados
    await SecureStore.setItemAsync('token', token);
    set({ token, user });
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ token: null, user: null });
  },
}));