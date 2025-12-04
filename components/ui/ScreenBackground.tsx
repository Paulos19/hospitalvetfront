import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, View, ViewProps } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ScreenBackgroundProps extends ViewProps {
  children: React.ReactNode;
}

export function ScreenBackground({ children, style, ...props }: ScreenBackgroundProps) {
  return (
    <View className="flex-1 bg-white" {...props}>
      <View className="absolute inset-0 bg-white" />
      <View className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none">
        <IconPattern name="paw" top={50} left={20} size={45} rotate="-15deg" />
        <IconPattern name="medical" top={120} right={-10} size={65} rotate="20deg" />
        <IconPattern name="heart" top={250} left={50} size={35} rotate="45deg" />
        <IconPattern name="paw" top={400} right={40} size={55} rotate="-10deg" />
        <IconPattern name="medkit" bottom={150} left={-20} size={85} rotate="15deg" />
        <IconPattern name="paw" bottom={50} right={20} size={45} rotate="30deg" />
      </View>
      <View style={style} className="flex-1">
        {children}
      </View>
    </View>
  );
}

function IconPattern({ name, top, left, right, bottom, size, rotate }: any) {
  return (
    <View style={{ position: 'absolute', top, left, right, bottom, transform: [{ rotate }] }}>
      <Ionicons name={name} size={size} color="#10B981" /> 
    </View>
  );
}