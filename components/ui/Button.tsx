import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
}

export function Button({ title, loading, variant = 'primary', className, ...props }: ButtonProps) {
  const baseStyle = "rounded-2xl py-4 items-center justify-center flex-row";
  
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
      className={`${baseStyle} ${variants[variant]} ${className} ${loading ? 'opacity-70' : ''}`}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#10B981'} />
      ) : (
        <Text className={textVariants[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}