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

  // Definição de cores (Primary 500 = Emerald Green conforme seu tailwind.config)
  const activeColor = '#10B981';
  const inactiveColor = '#9CA3AF'; // Gray 400
  const backgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';

  return (
    <View
      className="absolute bottom-0 left-0 right-0 items-center justify-end"
      style={{ paddingBottom: bottom + 10 }} // Ajuste para respeitar a área segura do dispositivo
      pointerEvents="box-none"
    >
      <View
        className="flex-row bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-black/10 border border-gray-100 dark:border-gray-700 mx-10 py-3 px-2 absolute bottom-6 w-[90%] justify-around items-center"
        style={{ elevation: 10, backgroundColor }} // Elevation para sombra no Android
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          // 1. FILTRAGEM: Remove rotas que não devem aparecer na TabBar
          // Verifica se href é null (padrão Expo Router para ocultar) ou nomes específicos de rotas internas
          // @ts-ignore: 'href' existe nas options do Expo Router
          if (options.href === null || route.name === 'pet/[id]' || route.name === 'new-pet' || route.name === 'prescription/create') {
            return null;
          }

          // 2. ÍCONES: Mapeia o nome da rota para um ícone do Ionicons
          // Adicione aqui outros mapeamentos conforme necessário
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
              // Feedback tátil ao trocar de aba (Apenas iOS suporta styles nativos, Android vibra padrão)
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

// Sub-componente para o Ícone da Aba com Animações
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

  // Animação de escala e "pulo" do ícone
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isFocused ? 1.05 : 1, { damping: 10, stiffness: 100 }) },
        { translateY: withTiming(isFocused ? -2 : 0, { duration: 200 }) }
      ],
    };
  });

  // Cor do ícone: Branco se ativo (para contraste com o fundo verde), Cinza se inativo
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
        {/* Background Circular: Sólido e colorido se ativo, Transparente se inativo */}
        <View
          className={`w-12 h-12 items-center justify-center rounded-full ${
            isFocused ? 'bg-primary-500 shadow-sm shadow-emerald-500/40' : 'bg-transparent'
          }`}
        >
          <Ionicons
            name={isFocused ? iconName : `${iconName}-outline` as any}
            size={24}
            color={iconColor}
          />
        </View>
      </Animated.View>

      {/* Label com animação de entrada (Fade In) - só aparece quando selecionado */}
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