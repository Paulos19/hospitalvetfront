import { Button } from '@/components/ui/Button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parâmetros dinâmicos (com valores padrão caso não sejam passados)
  const title = params.title || 'Sucesso!';
  const subtitle = params.subtitle || 'Ação concluída com sucesso.';
  const nextRoute = params.nextRoute as string || '/(client)/home';
  const buttonText = params.buttonText || 'Continuar';

  function handleContinue() {
    // replace previne que o usuário volte para a tela de sucesso ao clicar em "voltar"
    router.replace(nextRoute as any);
  }

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      
      {/* Animação */}
      <View className="w-64 h-64 mb-6">
        <LottieView
          source={require('../assets/animations/success.json')}
          autoPlay
          loop={false} // Toca apenas uma vez
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      {/* Textos */}
      <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
        {title}
      </Text>
      
      <Text className="text-gray-500 text-center text-lg mb-12 px-4 leading-6">
        {subtitle}
      </Text>

      {/* Botão de Ação */}
      <View className="w-full">
        <Button 
            title={buttonText as string}
            onPress={handleContinue}
            className="bg-green-500 shadow-green-500/30 py-4"
        />
      </View>

    </SafeAreaView>
  );
}