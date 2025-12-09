import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import "../global.css";

// Imports da sua aplicação
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { api } from "../src/services/api";
import { useAuthStore } from "../src/store/authStore"; // Ajuste o caminho se necessário

// 1. Configuração global de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Impede a splash screen de sumir antes de verificarmos o login
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  
  // Hooks
  const { expoPushToken, notification } = usePushNotifications(); // Notificações
  const { token, signIn, signOut } = useAuthStore(); // Auth
  const [isChecking, setIsChecking] = useState(true);

  // 2. Efeito para verificar o Login ao iniciar
  useEffect(() => {
    checkAuth();
  }, []);

  // 3. Efeito para logar o Token de Notificação (Opcional)
  useEffect(() => {
    if (expoPushToken) {
      console.log("Token de Notificação:", expoPushToken);
    }
  }, [expoPushToken]);

  // Função Principal: Verifica se o usuário já está logado
  async function checkAuth() {
    try {
      // A. Se não tem token salvo, libera para a tela inicial (Login)
      if (!token) {
        setIsChecking(false);
        SplashScreen.hideAsync();
        return;
      }

      // B. Se TEM token, valida no backend e pega dados atualizados (como myVetId)
      const response = await api.get('/users/me');
      const updatedUser = response.data;

      // C. Atualiza a store
      signIn(token, updatedUser);

      // D. Redirecionamento Inteligente
      // Só redireciona se o usuário estiver na raiz ou telas de auth
      const inAuthGroup = segments[0] === '(admin)' || segments[0] === '(client)' || segments[0] === '(vet)';

      if (!inAuthGroup) {
        if (updatedUser.role === 'CLIENT') {
          if (updatedUser.myVetId) {
            router.replace('/(client)/home');
          } else {
            router.replace('/link-vet');
          }
        } else if (updatedUser.role === 'VET') {
          router.replace('/(vet)/dashboard');
        } else if (updatedUser.role === 'ADMIN') {
          router.replace('/(admin)/dashboard');
        }
      }

    } catch (error) {
      console.log("Sessão expirada:", error);
      signOut(); // Limpa o token inválido
      router.replace('/'); 
    } finally {
      setIsChecking(false);
      SplashScreen.hideAsync();
    }
  }

  // Enquanto verifica o login, mantém a tela de splash (não renderiza nada)
  if (isChecking) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rotas Públicas */}
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="onboarding" />
      
      {/* Rota de Bloqueio */}
      <Stack.Screen name="link-vet" options={{ gestureEnabled: false }} /> 

      {/* Rotas Protegidas */}
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(vet)" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}