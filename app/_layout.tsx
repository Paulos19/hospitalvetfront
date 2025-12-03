import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rotas Públicas */}
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboarding" />

      {/* Rotas Protegidas (Grupos de Navegação) */}
      {/* É obrigatório registrar esses grupos para que o contexto de navegação flua corretamente */}
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(vet)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}