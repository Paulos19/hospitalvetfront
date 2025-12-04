import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Cores do Tema
const ACTIVE_BG_COLOR = '#059669'; // Verde Esmeralda
const ACTIVE_ICON_COLOR = '#FFFFFF'; // Branco
const INACTIVE_ICON_COLOR = '#9CA3AF'; // Cinza

const TabItem = ({ 
  route, 
  index, 
  state, 
  descriptors, 
  navigation
}: any) => {
  const { options } = descriptors[route.key];
  const isFocused = state.index === index;

  // Valores animados
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      // Sobe o ícone suavemente
      translateY.value = withSpring(-12, { damping: 12 });
    } else {
      translateY.value = withTiming(0);
    }
  }, [isFocused]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  const Icon = options.tabBarIcon;

  return (
    <View style={styles.tabItemContainer}>
      <Animated.View style={[styles.itemWrapper, animatedContainerStyle]}>
        
        {/* Fundo Verde (Círculo) - Só aparece se focado */}
        {isFocused && (
          <Animated.View 
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.activeBackground}
          />
        )}

        {/* Ícone Clicável */}
        <View onTouchEnd={onPress} style={styles.touchableArea}>
          {Icon ? Icon({
            focused: isFocused,
            color: isFocused ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR,
            size: 24
          }) : null}
        </View>

      </Animated.View>
    </View>
  );
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // FILTRO ROBUSTO:
  // 1. Remove rotas com href: null (Expo Router)
  // 2. Remove rotas com tabBarButton: () => null (React Navigation standard)
  // 3. Remove rotas de sistema (_sitemap, etc)
  const visibleRoutes = state.routes.filter(route => {
    const { options } = descriptors[route.key];
    
    // @ts-ignore
    if (options.href === null) return false;
    // @ts-ignore
    if (options.tabBarButton && options.tabBarButton() === null) return false;
    
    if (['_sitemap', '+not-found'].includes(route.name)) return false;
    
    return true;
  });

  if (visibleRoutes.length === 0) return null;

  return (
    <View style={[styles.container, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 10 }]}>
      <View style={styles.tabBar}>
        {visibleRoutes.map((route, index) => {
          const originalIndex = state.routes.findIndex(r => r.key === route.key);
          
          return (
            <TabItem
              key={route.key}
              route={route}
              index={originalIndex}
              state={state}
              descriptors={descriptors}
              navigation={navigation}
            />
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
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    width: '90%',
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
    // Sombras
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tabItemContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  activeBackground: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ACTIVE_BG_COLOR,
    // Sombra do botão verde
    shadowColor: ACTIVE_BG_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  touchableArea: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Garante que o ícone fique sobre o fundo verde
  }
});