import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { api } from '../src/services/api';

export interface PushNotificationState {
  expoPushToken?: string;
  notification?: Notifications.Notification;
}

export function usePushNotifications(): PushNotificationState {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  
  // CORREÇÃO AQUI: Inicializando com null para satisfazer o TypeScript
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

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

      // Tenta obter o Project ID do app.json/eas.json
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      try {
        // Se tiver projectId (EAS Build), usa ele. Se não, tenta pegar sem (Expo Go).
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId,
        });
        token = tokenData.data;
        console.log("Push Token Obtido:", token);
      } catch (e) {
        console.log("Erro ao pegar token:", e);
      }
    } else {
      console.log('Aviso: Push Notifications não funcionam em emuladores. Use um dispositivo físico.');
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      
      if (token) {
        // Envia para o backend salvar
        api.post('/users/push-token', { pushToken: token })
           .then(() => console.log("Token salvo no backend!"))
           .catch(err => console.log("Erro ao salvar token no backend (ignorável em dev):", err));
      }
    });

    // Listener para notificações recebidas com o app aberto
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener para quando o usuário toca na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notificação clicada:", response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
}