import { TabBar } from '@/components/ui/components/ui/TabBar';
import { Tabs } from 'expo-router';

export default function ClientLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Garante que a nativa suma
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ title: 'Início' }} 
      />
      
      {/* Rotas ocultas */}
      <Tabs.Screen name="new-pet" options={{ href: null }} />
      <Tabs.Screen name="pet/[id]" options={{ href: null }} />

      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Perfil' }} 
      />
    </Tabs>
  );
}