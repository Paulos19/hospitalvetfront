import { TabBar } from '@/components/ui/TabBar';
import { Tabs } from 'expo-router';

export default function VetLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ title: 'Pacientes' }} 
      />
      
      {/* Rotas ocultas */}
      <Tabs.Screen name="pet/[id]" options={{ href: null }} />
      <Tabs.Screen name="prescription/create" options={{ href: null }} />

      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Perfil' }} 
      />
    </Tabs>
  );
}