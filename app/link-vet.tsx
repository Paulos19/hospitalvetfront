import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore'; // Vamos precisar atualizar o usuário no store

// Seus componentes de UI
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LinkVetScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [vetToken, setVetToken] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLink() {
    if (!vetToken) return Alert.alert('Atenção', 'Digite o código do veterinário.');

    setLoading(true);
    try {
      // Chama a rota que criamos no backend para vincular
      await api.post('/users/link-vet', { vetToken: vetToken.toUpperCase() });
      
      // Atualiza o estado local para remover a flag de bloqueio (se houver)
      // E redireciona para a Home
      Alert.alert('Sucesso!', 'Seu perfil foi vinculado.', [
        { 
          text: 'Continuar', 
          onPress: () => router.replace('/(client)/home') 
        }
      ]);
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
          <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4">
            <Ionicons name="lock-closed" size={40} color="#F97316" />
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
            <Text className="text-orange-800 text-sm font-bold mb-2 uppercase text-center">
                Código do Médico
            </Text>
            <Input 
                placeholder="EX: VET-SILVA"
                value={vetToken}
                onChangeText={t => setVetToken(t.toUpperCase())}
                autoCapitalize="characters"
                className="bg-white text-center font-bold text-lg mb-0"
            />
        </View>

        <Button 
            title="Validar e Entrar"
            onPress={handleLink}
            loading={loading}
            className="bg-orange-500 shadow-orange-500/30"
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