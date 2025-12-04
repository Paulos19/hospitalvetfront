import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button'; // Ajuste o caminho conforme sua estrutura
import { Input } from '../components/ui/Input'; // Ajuste o caminho conforme sua estrutura
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore';

export default function LinkVetScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [vetToken, setVetToken] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLink() {
    if (!vetToken) return Alert.alert('Atenção', 'Digite o código do veterinário.');

    setLoading(true);
    try {
      await api.post('/users/link-vet', { vetToken: vetToken.toUpperCase() });
      
      // SUCESSO: Redireciona para a tela de animação
      router.replace({
        pathname: '/success',
        params: {
          title: 'Vínculo Realizado!',
          subtitle: 'Agora você tem acesso completo aos serviços do seu veterinário.',
          nextRoute: '/(client)/home',
          buttonText: 'Acessar App'
        }
      });

    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Token inválido.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        <View className="items-center mb-8">
          {/* Animação de Segurança/Cadeado */}
          <View className="w-40 h-40 mb-2">
            <LottieView
              // Certifique-se de ter baixado o arquivo secure-lock.json
              source={require('../assets/animations/secure-lock.json')}
              autoPlay
              loop
              style={{ width: '100%', height: '100%' }}
            />
          </View>

          <Text className="text-2xl font-bold text-gray-800 text-center">
            Acesso Restrito
          </Text>
          <Text className="text-gray-500 text-center mt-2 px-4">
            Olá, <Text className="font-bold text-gray-700">{user?.name}</Text>!{'\n'}
            Para usar o aplicativo, você precisa vincular sua conta a um veterinário parceiro.
          </Text>
        </View>

        <View className="bg-orange-50 p-6 rounded-3xl border border-orange-100 border-dashed mb-8">
            <View className="flex-row justify-center mb-2">
                <Ionicons name="key-outline" size={20} color="#C2410C" /> 
                <Text className="text-orange-800 text-sm font-bold ml-2 uppercase text-center">
                    Código do Médico
                </Text>
            </View>
            <Input 
                placeholder="EX: VET-SILVA"
                value={vetToken}
                onChangeText={t => setVetToken(t.toUpperCase())}
                autoCapitalize="characters"
                className="bg-white text-center font-bold text-lg mb-0 h-14"
            />
        </View>

        <Button 
            title="Validar e Entrar"
            onPress={handleLink}
            loading={loading}
            className="bg-orange-500 shadow-orange-500/30 py-4"
        />

        <View className="mt-6 items-center">
            <Text onPress={() => router.replace('/')} className="text-gray-400 text-sm p-2">
                Sair e tentar outra conta
            </Text>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}