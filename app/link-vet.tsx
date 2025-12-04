import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../src/services/api';
import { useAuthStore } from '../src/store/authStore';

export default function LinkVetScreen() {
  const router = useRouter();
  const { updateUser } = useAuthStore();
  
  const [inviteToken, setInviteToken] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLink() {
    // Validação básica para não enviar vazio
    if (!inviteToken || inviteToken.trim() === '') {
      return Alert.alert('Erro', 'Por favor, digite o código do veterinário.');
    }

    setLoading(true);
    try {
      // Envia o token limpo (sem espaços) para o backend
      const response = await api.post('/users/link-vet', { 
        inviteToken: inviteToken.trim() 
      });
      
      const { vetName, vetId } = response.data;

      // 1. Atualiza o estado global do AuthStore para refletir que o usuário já tem vínculo
      updateUser({ myVetId: vetId });
      
      // 2. Redireciona para a Tela de Sucesso, passando o nome do médico
      router.replace({
        pathname: '/success',
        params: { vetName: vetName || 'Veterinário' }
      });

    } catch (error: any) {
      const msg = error.response?.data?.error || 'Código inválido ou não encontrado.';
      Alert.alert('Falha ao vincular', msg);
    } finally {
      setLoading(false);
    }
  }

  // Função para logout caso o usuário tenha entrado na conta errada
  async function handleLogout() {
    const { signOut } = useAuthStore.getState();
    await signOut();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Botão de Sair no topo (canto superior direito) */}
      <View className="px-6 pt-4 flex-row justify-end">
        <TouchableOpacity 
          onPress={handleLogout} 
          className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
        >
          <Text className="text-gray-500 mr-1 text-xs font-medium">Sair da conta</Text>
          <Ionicons name="log-out-outline" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Container principal que evita o teclado cobrir os inputs */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            paddingHorizontal: 24,
            paddingBottom: 40 
          }} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Animação e Textos */}
          <View className="items-center mb-8">
            <LottieView
              source={require('../assets/animations/dog-onboarding.json')}
              autoPlay
              loop
              style={{ width: 250, height: 250 }} 
            />
            
            <Text className="text-2xl font-bold text-gray-800 text-center -mt-4">
              Vincular Veterinário
            </Text>
            
            <Text className="text-gray-500 text-center mt-2 px-2 leading-5">
              Insira o <Text className="font-bold text-gray-700">Código de Convite</Text> fornecido pelo seu médico para acessar seus dados.
            </Text>
          </View>

          {/* Input do Token */}
          <View className="mb-6">
            <Input 
              placeholder="Ex: DR-SILVA-123" 
              icon="qr-code-outline"
              autoCapitalize="characters" // Facilita digitar códigos em maiúsculas
              autoCorrect={false}
              value={inviteToken}
              onChangeText={setInviteToken}
              onSubmitEditing={handleLink}
            />
          </View>

          {/* Botão Principal */}
          <Button 
            title="Confirmar Vínculo" 
            onPress={handleLink}
            loading={loading}
          />

          {/* Link de Ajuda */}
          <TouchableOpacity 
            className="mt-8 items-center" 
            onPress={() => Alert.alert('Ajuda', 'Peça ao seu veterinário o código "Invite Token" disponível no perfil dele.')}
          >
            <Text className="text-emerald-600 font-medium text-sm">
              Onde encontro este código?
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}