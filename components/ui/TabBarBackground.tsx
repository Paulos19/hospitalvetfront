import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabBarBackground() {
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        // No iOS, usamos o BlurView para o efeito de vidro
        <BlurView
          tint="systemChromeMaterial" // Adapta-se ao tema (claro/escuro) automaticamente
          intensity={80}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        // No Android, usamos uma View com cor sólida (branco ou escuro via tema)
        // O estilo será controlado pelo backgroundColor definido no _layout.tsx
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    // Arredondamento opcional se você quiser a tab bar flutuante
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
});