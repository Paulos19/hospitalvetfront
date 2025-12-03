import * as Notifications from 'expo-notifications';
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";

// Importe o hook que acabámos de criar
import { usePushNotifications } from "@/hooks/usePushNotifications";

// Configuração global de notificações: define como o app deve se comportar 
// quando recebe uma notificação enquanto está ABERTO (foreground).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Deprecated, mas mantido para compatibilidade
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Novo: mostra o banner no topo
    shouldShowList: true,   // Novo: mostra na central de notificações
  }),
});

export default function RootLayout() {
  
  // Inicializa o sistema de notificações e regista o token no backend
  const { expoPushToken, notification } = usePushNotifications();

  useEffect(() => {
    // Opcional: Ignorar logs chatos de warnings conhecidos se necessário
    // LogBox.ignoreLogs(['Warning: ...']);

    if (expoPushToken) {
        console.log("App pronto para receber notificações. Token:", expoPushToken);
    }
  }, [expoPushToken]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rotas Públicas (Autenticação) */}
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboarding" />
      
      {/* Rota de Bloqueio/Vínculo Obrigatório */}
      {/* gestureEnabled: false impede que o utilizador "volte" deslizando o dedo */}
      <Stack.Screen name="link-vet" options={{ gestureEnabled: false }} /> 

      {/* Rotas Protegidas (Grupos de Navegação) */}
      {/* É crucial registar estes grupos aqui para o contexto de navegação funcionar */}
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(vet)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}