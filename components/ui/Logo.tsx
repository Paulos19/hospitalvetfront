import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function Logo({ size = 'medium', showText = true }: LogoProps) {
  // Configuração de tamanhos baseados na prop 'size'
  const sizes = {
    small: {
      container: 'w-10 h-10',
      icon: 20,
      title: 'text-xl',
      subtitle: 'text-[8px]',
      gap: 'gap-2',
    },
    medium: {
      container: 'w-16 h-16',
      icon: 32,
      title: 'text-3xl',
      subtitle: 'text-[10px]',
      gap: 'gap-3',
    },
    large: {
      container: 'w-24 h-24',
      icon: 48,
      title: 'text-5xl',
      subtitle: 'text-xs',
      gap: 'gap-4',
    },
  };

  const currentSize = sizes[size];

  return (
    <View className={`flex-row items-center justify-center ${currentSize.gap}`}>
      {/* Ícone Gráfico */}
      <View 
        className={`${currentSize.container} bg-primary-500 items-center justify-center rounded-2xl shadow-lg shadow-primary-500/40 transform -rotate-6`}
      >
        <Ionicons name="medical" size={currentSize.icon} color="white" />
        <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
            <Ionicons name="paw" size={currentSize.icon / 2.5} color="#10b981" /> 
        </View>
      </View>

      {/* Tipografia */}
      {showText && (
        <View>
          <Text className={`${currentSize.title} font-extrabold text-slate-800 leading-tight`}>
            HVG
          </Text>
          <Text className={`${currentSize.subtitle} font-bold text-primary-600 tracking-[0.2em] uppercase`}>
            Hospital Vet
          </Text>
        </View>
      )}
    </View>
  );
}