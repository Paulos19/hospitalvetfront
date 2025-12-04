import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Hook para saber a área segura (principalmente no iPhone X/11/12+ que tem a barra preta embaixo)
  const insets = useSafeAreaInsets();

  return (
    // Container Invisível para posicionamento
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      
      {/* A Barra Flutuante Real */}
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          
          // Ignora rotas ocultas (como sitemap ou not-found do Expo)
          if (['_sitemap', '+not-found'].includes(route.name)) return null;

          // Se a opção href for null (rota oculta), não renderiza
          // @ts-ignore
          if (options.href === null) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Cores
          const activeColor = '#059669'; // Emerald 600
          const inactiveColor = '#9CA3AF'; // Gray 400

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              // @ts-ignore: tabBarTestID might not be in the type definition for some versions
              testID={(options as any).tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {/* Renderiza o ícone definido no _layout.tsx */}
              {options.tabBarIcon && options.tabBarIcon({ 
                focused: isFocused, 
                color: isFocused ? activeColor : inactiveColor, 
                size: 24 
              })}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent', // Garante que o container pai não tenha fundo
    pointerEvents: 'box-none', // Permite clicar "através" da área vazia ao redor da tabbar
  },
  tabBar: {
    flexDirection: 'row',
    width: '90%', // Largura menor que 100% para dar o efeito flutuante
    backgroundColor: '#ffffff', // Fundo sempre branco
    borderRadius: 35, // Arredondamento forte (Pill shape)
    paddingVertical: 12, // Altura interna
    justifyContent: 'space-around',
    alignItems: 'center',
    
    // Sombras (iOS)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    
    // Sombras (Android)
    elevation: 8,
    
    // Curva suave no iOS
    ...Platform.select({
      ios: {
        borderCurve: 'continuous',
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
});