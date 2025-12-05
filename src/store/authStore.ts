import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  myVetId?: string | null; // Importante para saber se tem vínculo
  photoUrl?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      signIn: (token, user) => set({ token, user }),
      signOut: () => set({ token: null, user: null }),
      updateUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
    }),
    {
      name: 'auth-storage', // Nome da chave no armazenamento
      storage: createJSONStorage(() => AsyncStorage), // Usa o storage do celular
    }
  )
);