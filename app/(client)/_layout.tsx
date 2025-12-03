import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function ClientLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#10B981', // primary-500
      tabBarStyle: { borderTopWidth: 0, elevation: 5 }
    }}>
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Meus Pets',
          tabBarIcon: ({ color }) => <Ionicons name="paw" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}