import { useColorScheme } from '@/hooks/use-color-scheme';
import { MotiView } from 'moti';
import { ViewProps } from 'react-native';

// Estendemos ViewProps para herdar propriedades padrão como style
interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string; // Adicionando explicitamente o className
}

export function Skeleton({ width, height, borderRadius = 8, style, className, ...props }: SkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true,
      }}
      // O 'as any' aqui evita erro de tipagem caso o Moti não tenha types do NativeWind
      {...(props as any)}
      className={className}
      style={[
        {
          width: width,
          height: height,
          borderRadius: borderRadius,
          backgroundColor: isDark ? '#374151' : '#E5E7EB', 
        },
        style,
      ]}
    />
  );
}