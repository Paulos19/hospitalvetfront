import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { TabBar } from '@/components/ui/TabBar';

export default function ClientLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* --- ABAS VISÍVEIS --- */}
      
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="new-pet"
        options={{
          title: 'Novo Pet',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* --- ROTAS OCULTAS (Não aparecem na TabBar) --- */}

      {/* 1. Tela de Detalhes do Pet */}
      <Tabs.Screen
        name="pet/[id]"
        options={{
          href: null,
        }}
      />

      {/* 2. Sub-rotas do Pet (Vacinas e Receitas) */}
      <Tabs.Screen
        name="pet/[id]/vaccines"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="pet/[id]/prescriptions"
        options={{
          href: null,
        }}
      />

      {/* 3. Tela de Notificações */}
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}