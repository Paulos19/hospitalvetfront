import { Image as ExpoImage, ImageProps } from 'expo-image';
import { cssInterop } from 'nativewind';

// Habilita o suporte ao className do NativeWind no componente do Expo Image
cssInterop(ExpoImage, { className: 'style' });

export function Image({ style, ...props }: ImageProps) {
  return (
    <ExpoImage 
      style={style} 
      {...props} 
      // O Expo Image usa 'contentFit' em vez de 'resizeMode'
      // Mapeamos o padrão 'cover' se não for especificado
      contentFit={props.contentFit || 'cover'}
      transition={200} // Efeito suave ao carregar
    />
  );
}