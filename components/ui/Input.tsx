import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface InputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function Input({ icon, isPassword, className, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View 
      className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3.5 mb-4 ${
        isFocused ? 'border-primary-500 bg-white' : 'border-gray-100'
      } ${className}`}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={20} 
          color={isFocused ? '#10B981' : '#9CA3AF'} 
          style={{ marginRight: 12 }} 
        />
      )}
      
      <TextInput
        className="flex-1 text-gray-800 text-base"
        placeholderTextColor="#9CA3AF"
        secureTextEntry={isPassword && !showPassword}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons 
            name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
            size={20} 
            color="#9CA3AF" 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}