import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#047857', // primary-700 (mais escuro)
      tabBarStyle: { borderTopWidth: 0, elevation: 5 }
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{
          title: 'Gestão',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />
        }} 
      />
      {/* Você pode adicionar mais abas aqui no futuro, como "Financeiro" ou "Configurações" */}
    </Tabs>
  );
}