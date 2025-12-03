import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function VetLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#10B981',
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{
          title: 'Meus Pacientes',
          tabBarIcon: ({ color }) => <Ionicons name="paw" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="medical" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}