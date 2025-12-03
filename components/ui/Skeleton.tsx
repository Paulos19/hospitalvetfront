import { useColorScheme } from '@/hooks/use-color-scheme';
import { MotiView } from 'moti';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width, height, borderRadius = 8, style }: SkeletonProps) {
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
      style={[
        {
          width: width,
          height: height,
          borderRadius: borderRadius,
          backgroundColor: isDark ? '#374151' : '#E5E7EB', // Gray-700 : Gray-200
        },
        style,
      ]}
    />
  );
}