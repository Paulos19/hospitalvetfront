import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rotas Públicas */}
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="onboarding" />

      {/* Rotas Protegidas (Grupos) */}
      {/* É crucial registrar esses grupos para que a navegação interna funcione */}
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(vet)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}