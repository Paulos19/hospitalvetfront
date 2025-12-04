import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/ui/Button';

export default function SuccessScreen() {
  const router = useRouter();
  const { vetName } = useLocalSearchParams();

  function handleContinue() {
    // Redireciona para a Home do Cliente e reseta a pilha de navegação
    router.replace('/(client)/home');
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
      <StatusBar barStyle="dark-content" />

      {/* Animação de Sucesso */}
      <View className="items-center mb-8">
        <LottieView
          source={require('../assets/animations/success.json')}
          autoPlay
          loop={false} // Toca apenas uma vez
          style={{ width: 200, height: 200 }}
        />
      </View>

      {/* Título */}
      <Text className="text-3xl font-bold text-emerald-600 text-center mb-4">
        Tudo Pronto!
      </Text>

      {/* Mensagem Personalizada */}
      <Text className="text-gray-500 text-center text-base leading-6 mb-12">
        Sua conta foi vinculada com sucesso.
        {vetName ? (
          <>
            {'\n'}Agora você está sendo atendido pelo(a){'\n'}
            <Text className="font-bold text-gray-800">{vetName}</Text>.
          </>
        ) : (
          '\nAgora você tem acesso completo aos serviços da clínica.'
        )}
      </Text>

      {/* Botão de Ação */}
      <Button 
        title="Acessar App" 
        onPress={handleContinue}
        className="w-full"
      />

    </SafeAreaView>
  );
}