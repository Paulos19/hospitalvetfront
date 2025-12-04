import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '../components/ui/Logo'; // <--- IMPORTAÇÃO

export default function OnboardingScreen() {
  const router = useRouter();

  async function handleFinish() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos da sua localização para encontrar clínicas próximas no futuro.');
      return;
    }

    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/');
  }

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-between py-10 px-6">
      <View className="items-center mt-10 w-full flex-1 justify-center">
        
        {/* LOGO NO TOPO */}
        <View className="mb-10 scale-110">
           <Logo size="medium" />
        </View>

        {/* ANIMAÇÃO */}
        <View className="w-full h-64 items-center justify-center mb-6">
            <LottieView
              source={require('../assets/animations/dog-onboarding.json')}
              autoPlay
              loop
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
        </View>
        
        <Text className="text-3xl font-extrabold text-slate-800 text-center mb-4">
          Cães & Cia
        </Text>
        
        <Text className="text-gray-500 text-center text-lg leading-7 px-4">
          O jeito moderno de cuidar do seu melhor amigo. Vacinas, consultas e muito mais.
        </Text>
      </View>

      <View className="w-full mt-auto">
        <View className="flex-row items-center justify-center mb-8 space-x-2 bg-gray-50 py-3 rounded-lg border border-gray-100">
            <Ionicons name="location-outline" size={20} color="#9CA3AF" />
            <Text className="text-gray-500 text-xs text-center font-medium">
               Habilite a localização para uma melhor experiência
            </Text>
        </View>

        <TouchableOpacity 
          onPress={handleFinish}
          className="w-full bg-primary-500 py-4 rounded-2xl items-center shadow-xl shadow-primary-500/25 active:bg-primary-600"
        >
          <Text className="text-white font-bold text-lg">Começar Agora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}