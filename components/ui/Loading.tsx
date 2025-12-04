import LottieView from 'lottie-react-native';
import { View, ViewProps } from 'react-native';

interface LoadingProps extends ViewProps {
  size?: number; // Permite ajustar o tamanho
}

export function Loading({ size = 120, className, style, ...props }: LoadingProps) {
  return (
    <View 
      className={`items-center justify-center ${className}`} 
      style={style} 
      {...props}
    >
      <LottieView
        source={require('../../assets/animations/loading-paw.json')}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </View>
  );
}