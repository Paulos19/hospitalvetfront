import LottieView from 'lottie-react-native'; // <--- Importar
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
}

export function Button({ title, loading, variant = 'primary', className, ...props }: ButtonProps) {
  const baseStyle = "rounded-2xl py-4 items-center justify-center flex-row h-16"; // Fixei h-16 para consistência
  
  const variants = {
    primary: "bg-primary-500 shadow-lg shadow-primary-500/30",
    outline: "bg-transparent border border-gray-200",
    ghost: "bg-transparent"
  };

  const textVariants = {
    primary: "text-white font-bold text-lg",
    outline: "text-gray-700 font-bold text-lg",
    ghost: "text-primary-500 font-bold text-base"
  };

  return (
    <TouchableOpacity 
      disabled={loading}
      className={`${baseStyle} ${variants[variant]} ${className} ${loading ? 'opacity-90' : ''}`}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        // Substituindo ActivityIndicator pelo Lottie
        <View className="items-center justify-center w-full h-full">
            <LottieView 
                source={require('../../assets/animations/loading-paw.json')}
                autoPlay
                loop
                // Tamanho fixo para caber no botão. Ajuste se necessário.
                style={{ width: 60, height: 60 }} 
            />
        </View>
      ) : (
        <Text className={textVariants[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}