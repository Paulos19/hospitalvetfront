import { TabBar } from '@/components/ui/TabBar';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function VetLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Pacientes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          )
        }} 
      />
      
      {/* ROTA OCULTA: pet/[id] não aparecerá na TabBar */}
      <Tabs.Screen 
        name="pet/[id]" 
        options={{ 
          href: null, // Isso instrui a TabBar a ignorar esta rota
        }} 
      />

      {/* ROTA OCULTA: criação de receita */}
      <Tabs.Screen 
        name="prescription/create" 
        options={{ 
          href: null,
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          )
        }} 
      />
    </Tabs>
  );
}