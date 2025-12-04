import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'; // <--- Image importada
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const router = useRouter();

  async function handleFinish() {
    // 1. Pedir permissão de localização
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos da sua localização para encontrar clínicas próximas no futuro.');
      return;
    }

    // 2. Salvar que o usuário já viu o onboarding
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');

    // 3. Ir para o Login
    router.replace('/');
  }

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-between py-10 px-6">
      <View className="items-center mt-10 w-full">
        
        {/* LOGO ADICIONADA */}
        <Image 
          source={require('../assets/images/logo-hvg.png')} 
          className="w-36 h-24 mb-36" 
          resizeMode="contain"
        />

        {/* ANIMAÇÃO SUBSTITUINDO O ÍCONE */}
        <View className="w-full h-72 items-center justify-center mb-6">
            <LottieView
              source={require('../assets/animations/dog-onboarding.json')}
              autoPlay
              loop
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
        </View>
        
        <Text className="text-3xl font-bold text-primary-700 text-center mb-4">
          Cães & Cia
        </Text>
        
        <Text className="text-text-muted text-center text-lg leading-6 px-4">
          O cuidado que seu melhor amigo merece.{'\n'}
          Gerencie vacinas, consultas e histórico médico em um só lugar.
        </Text>
      </View>

      <View className="w-full">
        <View className="flex-row items-center justify-center mb-8 space-x-2">
            <Ionicons name="location-outline" size={20} color="#6B7280" />
            <Text className="text-text-muted text-sm text-center">
                Precisamos da sua localização para{'\n'}melhor experiência.
            </Text>
        </View>

        <TouchableOpacity 
          onPress={handleFinish}
          className="w-full bg-primary-500 py-4 rounded-2xl items-center shadow-lg shadow-primary-500/30 active:bg-primary-600"
        >
          <Text className="text-white font-bold text-xl">Começar Agora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}