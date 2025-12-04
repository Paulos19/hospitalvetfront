import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Platform,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { Skeleton } from '@/components/ui/Skeleton';
import { Notification, NotificationsService } from '@/src/services/notifications';

const NOTIFICATION_TYPES = {
  VACCINE: {
    icon: 'medkit',
    color: '#10B981', // Verde
    bg: '#ECFDF5',    
    label: 'Vacina'
  },
  PRESCRIPTION: {
    icon: 'document-text',
    color: '#8B5CF6', // Roxo
    bg: '#F5F3FF',    
    label: 'Receita'
  },
  APPOINTMENT: {
    icon: 'calendar',
    color: '#3B82F6', // Azul
    bg: '#EFF6FF',    
    label: 'Consulta'
  },
  GENERIC: {
    icon: 'notifications',
    color: '#6B7280', // Cinza
    bg: '#F3F4F6',    
    label: 'Aviso'
  }
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 2) {
    return 'Ontem';
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await NotificationsService.getNotifications();
      setNotifications(response.data);
      
      const unreadIds = response.data.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length > 0) {
        await NotificationsService.markAsRead(unreadIds);
      }
    } catch (error) {
      console.error("Erro ao carregar notificações", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item, index }: { item: Notification; index: number }) => {
    const typeConfig = NOTIFICATION_TYPES[item.type] || NOTIFICATION_TYPES.GENERIC;
    
    return (
      <MotiView
        from={{ opacity: 0, scale: 0.95, translateY: 10 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ delay: index * 100, type: 'timing', duration: 400 }}
      >
        <TouchableOpacity 
          activeOpacity={0.9}
          className="bg-white mx-5 mb-4 p-5 rounded-3xl shadow-sm shadow-gray-200 border border-gray-100 flex-row items-start relative overflow-hidden"
        >
          {!item.read && (
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
          )}

          <View 
            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
            style={{ backgroundColor: typeConfig.bg }}
          >
            <Ionicons name={typeConfig.icon as any} size={24} color={typeConfig.color} />
          </View>

          <View className="flex-1">
             <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {typeConfig.label}
                </Text>
                <Text className="text-xs text-gray-400">
                  {formatDate(item.createdAt)}
                </Text>
             </View>

             <Text className="text-gray-900 font-bold text-base mb-1 leading-5">
               {item.title}
             </Text>
             
             <Text className="text-gray-500 text-sm leading-5">
               {item.message}
             </Text>

             {item.pet && (
               <View className="mt-3 self-start bg-gray-50 border border-gray-100 px-3 py-1 rounded-full flex-row items-center">
                 <Ionicons name="paw" size={10} color="#6B7280" style={{ marginRight: 4 }} />
                 <Text className="text-xs text-gray-600 font-semibold">{item.pet.name}</Text>
               </View>
             )}
          </View>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <ScreenBackground>
      <Stack.Screen options={{ headerShown: false }} />
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ 
          paddingBottom: 100, 
          paddingTop: Platform.OS === 'android' ? 60 : 80 
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNotifications(); }} />
        }
        ListHeaderComponent={
          <View className="px-6 mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mb-4 w-10 h-10 bg-white items-center justify-center rounded-full shadow-sm">
                <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-3xl font-extrabold text-gray-900">
              Notificações
            </Text>
            <Text className="text-gray-500 text-base mt-1">
              Fique por dentro da saúde do seu pet
            </Text>
          </View>
        }
        // CORREÇÃO AQUI: Trocado && por ternário ? : null
        ListEmptyComponent={!loading ? (
          <View className="items-center justify-center mt-10 px-10">
            <View className="bg-white p-8 rounded-full shadow-sm mb-6">
               <Ionicons name="chatbubble-ellipses-outline" size={48} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-bold text-gray-800 text-center mb-2">
              Nenhuma novidade
            </Text>
            <Text className="text-gray-400 text-center leading-5">
              Por enquanto está tudo tranquilo. Avisaremos aqui quando houver atualizações.
            </Text>
          </View>
        ) : null}
      />
      
      {loading && (
        <View className="absolute top-40 left-0 right-0 px-5">
           {[1, 2, 3].map(i => (
             <View key={i} className="mb-4 bg-white p-5 rounded-3xl flex-row shadow-sm">
                <Skeleton className="w-12 h-12 rounded-2xl mr-4" />
                <View className="flex-1">
                   <Skeleton className="w-20 h-3 mb-2 rounded" />
                   <Skeleton className="w-full h-10 mb-2 rounded" />
                </View>
             </View>
           ))}
        </View>
      )}
    </ScreenBackground>
  );
}