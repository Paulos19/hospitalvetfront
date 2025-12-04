// app/(admin)/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function AdminLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#10B981', // Cor primária (Emerald 500)
          },
          headerTintColor: '#fff', // Texto branco
          // REMOVIDO: headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
            name="dashboard" 
            options={{ 
                title: 'Painel Administrativo',
                headerShown: true,
            }} 
        />
        <Stack.Screen 
            name="create-vet" 
            options={{ 
                title: 'Cadastrar Veterinário',
                headerShown: true,
            }} 
        />
        <Stack.Screen 
            name="vet/[id]" 
            options={{ 
                title: 'Detalhes do Veterinário',
                headerShown: true,
            }} 
        />
      </Stack>
    </>
  );
}