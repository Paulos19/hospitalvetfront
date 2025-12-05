import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string | null;
  role: 'ADMIN' | 'VET' | 'CLIENT';
  inviteToken?: string | null;
  
  // CORREÇÃO: Adicionando campos que faltavam para o TypeScript não reclamar
  myVetId?: string | null; 
  crmv?: string | null;
  specialty?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: Partial<User>) => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  signIn: async (token, user) => {
    await SecureStore.setItemAsync('token', token);
    set({ token, user });
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ token: null, user: null });
    router.replace('/'); 
  },

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    }));
  }
}));