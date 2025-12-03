import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore'; // <--- 1. Importe a store

export interface PushNotificationState {
  expoPushToken?: string;
  notification?: Notifications.Notification;
}

export function usePushNotifications(): PushNotificationState {
  // 2. Pegue o usuário da store para saber se ele está logado
  const { user } = useAuthStore(); 
  
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Falha ao obter permissão de push!');
        return;
      }

      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId,
        });
        token = tokenData.data;
      } catch (e) {
        console.log("Erro ao pegar token:", e);
      }
    } else {
      console.log('Aviso: Push Notifications não funcionam em emuladores.');
    }

    return token;
  }

  // EFEITO 1: Inicializa as notificações e listeners (Roda ao abrir o app)
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      // Nota: Removemos o api.post daqui!
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notificação clicada:", response);
    });

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, []);

  // EFEITO 2: Monitora o login. Assim que o 'user' existir, envia o token.
  useEffect(() => {
    if (user && expoPushToken) {
      console.log(`Usuário ${user.name} logado. Enviando token...`);
      
      api.post('/users/push-token', { pushToken: expoPushToken })
         .then(() => console.log("Token vinculado ao usuário com sucesso!"))
         .catch(err => console.log("Erro ao salvar token (talvez token expirado):", err));
    }
  }, [user, expoPushToken]); // <--- Roda sempre que o usuário logar ou o token mudar

  return {
    expoPushToken,
    notification,
  };
}