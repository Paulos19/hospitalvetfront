import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { bottom } = useSafeAreaInsets();

  const activeColor = '#10B981';
  const inactiveColor = '#9CA3AF';
  const backgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';

  return (
    <View
      className="absolute bottom-0 left-0 right-0 items-center justify-end"
      style={{ paddingBottom: bottom + 10 }}
      pointerEvents="box-none"
    >
      <View
        className="flex-row bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-black/10 border border-gray-100 dark:border-gray-700 mx-10 py-3 px-2 absolute bottom-6 w-[90%] justify-around items-center"
        style={{ elevation: 10, backgroundColor }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          // Filtros de rotas ocultas
          // @ts-ignore
          if (options.href === null || route.name === 'pet/[id]' || route.name === 'new-pet' || route.name === 'prescription/create') {
            return null;
          }

          let iconName: any = 'help-circle';
          if (route.name === 'home' || route.name === 'dashboard') iconName = 'paw';
          if (route.name === 'profile') iconName = 'person';
          if (route.name === 'explore') iconName = 'compass';

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if (process.env.EXPO_OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TabIcon
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              iconName={iconName}
              label={label as string}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabIcon({
  isFocused,
  onPress,
  iconName,
  label,
  activeColor,
  inactiveColor
}: {
  isFocused: boolean;
  onPress: () => void;
  iconName: any;
  label: string;
  activeColor: string;
  inactiveColor: string;
}) {

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isFocused ? 1.05 : 1, { damping: 10, stiffness: 100 }) },
        { translateY: withTiming(isFocused ? -2 : 0, { duration: 200 }) }
      ],
    };
  });

  const iconColor = isFocused ? 'white' : inactiveColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="items-center justify-center min-w-[65px]"
      accessibilityState={{ selected: isFocused }}
      accessibilityRole="tab"
    >
      <Animated.View style={animatedStyle}>
        {/* CORREÇÃO CRÍTICA AQUI: 
           Removemos a classe dinâmica `bg-[${activeColor}]`.
           Usamos `style` para a cor de fundo dinâmica.
           Mantivemos as classes estáticas no className.
        */}
        <View
          className={`w-12 h-12 items-center justify-center rounded-full ${
            isFocused ? 'shadow-sm shadow-emerald-500/40' : ''
          }`}
          style={{ 
            backgroundColor: isFocused ? activeColor : 'transparent' 
          }}
        >
          <Ionicons
            name={isFocused ? iconName : `${iconName}-outline` as any}
            size={24}
            color={iconColor}
          />
        </View>
      </Animated.View>

      {isFocused && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="mt-1"
        >
          <ThemedText
            style={{
              fontSize: 11,
              color: activeColor,
              fontWeight: '600',
            }}
          >
            {label}
          </ThemedText>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}